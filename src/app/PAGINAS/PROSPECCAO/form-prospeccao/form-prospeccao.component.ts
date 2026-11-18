import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { Cliente } from '../../../modelo/Cliente';
import {
  CANAIS_CONTATO, ContatoProspeccao, DIAS_AVISO_CONTATO_RECENTE, HistoricoEquipamento, MODELOS_NOBREAK,
  NobreakBateriaVencida, PRAZOS_BATERIA, RESULTADOS_CONTATO, SituacaoProspeccao
} from '../../../modelo/Prospeccao';
import { OrdemservicoService } from '../../../servico/ordemservico.service';
import { ProspeccaoService } from '../../../servico/prospeccao.service';
import { ParametrosService } from '../../../servico/parametros.service';

/**
 * filtro do select "Situação" no cabeçalho da tabela:
 * 'TODOS' | situação (grupo) | 'RETORNO' (retorno vencido/hoje) | 'R:<código do resultado>'
 */
type FiltroSituacao = 'TODOS' | SituacaoProspeccao | 'RETORNO' | `R:${string}`;

/** linha do formulário de contato: um equipamento do cliente */
interface EquipamentoNoContato {
  item: NobreakBateriaVencida;
  marcado: boolean;
  resultado: string;
}

@Component({
  selector: 'app-form-prospeccao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './form-prospeccao.component.html',
  styleUrl: './form-prospeccao.component.css'
})
export class FormProspeccaoComponent implements OnInit, OnDestroy {

  readonly modelos = MODELOS_NOBREAK;
  readonly prazos = PRAZOS_BATERIA;

  formulario = new FormGroup({
    razaosocial: new FormControl<string>('', { nonNullable: true }),
    meses: new FormControl<number>(24, { nonNullable: true }),
    potenciaMinima: new FormControl<number | null>(null),
    potenciaMaxima: new FormControl<number | null>(null),
  });

  ///// BUSCA DE CLIENTE (razão social)
  clientesEncontrados: Cliente[] = [];
  clienteSelecionado: Cliente | null = null;
  buscandoClientes = false;
  nenhumClienteEncontrado = false;

  ///// RESULTADO
  resultado: NobreakBateriaVencida[] = [];
  pesquisou = false;
  carregando = false;
  mensagemErro = '';

  ///// DETALHAMENTO (modal)
  detalheAberto = false;
  itemDetalhe: NobreakBateriaVencida | null = null;
  clienteDetalhe: Cliente | null = null;
  historico: HistoricoEquipamento[] = [];
  carregandoDetalhe = false;
  erroDetalhe = '';

  ///// TELEMARKETING
  readonly canais = CANAIS_CONTATO;
  readonly resultadosContato = RESULTADOS_CONTATO;
  readonly diasAvisoRecente = DIAS_AVISO_CONTATO_RECENTE;
  atendentes: string[] = [];

  filtroSituacao: FiltroSituacao = 'TODOS';

  contatos: ContatoProspeccao[] = [];
  carregandoContatos = false;
  formContatoAberto = false;
  salvandoContato = false;
  erroContato = '';
  equipamentosNoContato: EquipamentoNoContato[] = [];
  resultadoParaTodos = '';
  novoContato = this.contatoVazio();

  private subs = new Subscription();

  constructor(
    private prospeccaoService: ProspeccaoService,
    private osService: OrdemservicoService,
    private parametrosService: ParametrosService,
  ) { }

  ngOnInit(): void {
    this.parametrosService.getAtendentes().subscribe({
      next: (lista) => this.atendentes = (lista ?? [])
        .map(a => (a.valor ?? '').trim())
        .filter(v => v.length > 0),
      error: () => this.atendentes = []
    });

    // Igual à Consulta de Cliente: a partir de 4 letras, lista os clientes que contêm o trecho
    this.subs.add(
      this.formulario.controls.razaosocial.valueChanges
        .pipe(debounceTime(350), distinctUntilChanged())
        .subscribe(valor => this.buscarClientes(valor))
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // ------------------------------------------------------------ cliente

  buscarClientes(valor: string): void {
    // se o texto é o do cliente já escolhido, não busca de novo
    if (this.clienteSelecionado && valor === this.clienteSelecionado.razaosocial) return;

    this.clienteSelecionado = null;
    this.nenhumClienteEncontrado = false;

    if (!valor || valor.trim().length < 4) {
      this.clientesEncontrados = [];
      return;
    }

    this.buscandoClientes = true;
    this.osService.getClientesPorRazaoSoocial(valor.trim()).subscribe({
      next: (dados) => {
        this.clientesEncontrados = dados ?? [];
        this.nenhumClienteEncontrado = this.clientesEncontrados.length === 0;
        this.buscandoClientes = false;
      },
      error: () => {
        // o backend devolve 404 quando não encontra nenhum cliente
        this.clientesEncontrados = [];
        this.nenhumClienteEncontrado = true;
        this.buscandoClientes = false;
      }
    });
  }

  selecionarCliente(cli: Cliente): void {
    this.clienteSelecionado = cli;
    this.clientesEncontrados = [];
    this.nenhumClienteEncontrado = false;
    this.formulario.controls.razaosocial.setValue(cli.razaosocial, { emitEvent: false });
  }

  limparCliente(): void {
    this.clienteSelecionado = null;
    this.clientesEncontrados = [];
    this.nenhumClienteEncontrado = false;
    this.formulario.controls.razaosocial.setValue('', { emitEvent: false });
  }

  // ------------------------------------------------------------ busca

  get potenciaInvalida(): boolean {
    const min = this.formulario.controls.potenciaMinima.value;
    const max = this.formulario.controls.potenciaMaxima.value;
    return min != null && max != null && Number(min) > Number(max);
  }

  buscar(): void {
    if (this.potenciaInvalida) return;

    const f = this.formulario.getRawValue();
    const codcli = this.clienteSelecionado ? Number(this.clienteSelecionado.id) : null;
    const potMin = f.potenciaMinima != null ? Number(f.potenciaMinima) : null;
    const potMax = f.potenciaMaxima != null ? Number(f.potenciaMaxima) : null;

    this.carregando = true;
    this.mensagemErro = '';
    this.prospeccaoService.buscarNobreaksBateriaVencida(codcli, Number(f.meses), potMin, potMax).subscribe({
      next: (dados) => {
        this.resultado = dados ?? [];
        this.pesquisou = true;
        this.carregando = false;
      },
      error: (erro) => {
        this.resultado = [];
        this.pesquisou = true;
        this.carregando = false;
        this.mensagemErro = typeof erro?.error === 'string' && erro.error
          ? erro.error
          : 'Erro ao consultar o servidor. Verifique se o backend está rodando.';
      }
    });
  }

  limparTudo(): void {
    this.limparCliente();
    this.formulario.patchValue({ meses: 24, potenciaMinima: null, potenciaMaxima: null }, { emitEvent: false });
    this.resultado = [];
    this.pesquisou = false;
    this.mensagemErro = '';
    this.filtroSituacao = 'TODOS';
  }

  ///// ALTURA DA TABELA: ocupa exatamente o espaço entre o topo da tabela e o rodapé fixo
  alturaTabela: number | null = null;
  private elTabela?: ElementRef<HTMLElement>;

  @ViewChild('tabelaResultado')
  set tabelaResultado(el: ElementRef<HTMLElement> | undefined) {
    this.elTabela = el;
    if (el) setTimeout(() => this.ajustarAlturaTabela()); // após a tabela aparecer na tela
  }

  @HostListener('window:resize')
  ajustarAlturaTabela(): void {
    if (!this.elTabela) return;
    const topoNaPagina = this.elTabela.nativeElement.getBoundingClientRect().top + window.scrollY;
    const rodape = document.querySelector('app-rodape') as HTMLElement | null;
    const alturaRodape = rodape ? rodape.getBoundingClientRect().height : 70;
    const folga = 16; // borda inferior do card + respiro
    this.alturaTabela = Math.max(200, Math.floor(window.innerHeight - topoNaPagina - alturaRodape - folga));
  }

  ///// ORDENAÇÃO DA TABELA
  ordenacao: 'cliente' | 'meses' = 'cliente';

  get resultadoOrdenado(): NobreakBateriaVencida[] {
    const lista = this.resultado.filter(n => this.passaNoFiltro(n, this.filtroSituacao));
    if (this.ordenacao === 'meses') {
      // mais vencidos primeiro; empate -> cliente
      lista.sort((a, b) =>
        (b.mesesDesdeManutencao ?? 0) - (a.mesesDesdeManutencao ?? 0)
        || (a.fantasia ?? '').localeCompare(b.fantasia ?? '', 'pt-BR'));
    } else {
      // cliente A–Z; dentro do cliente, mais vencidos primeiro
      lista.sort((a, b) =>
        (a.fantasia ?? '').localeCompare(b.fantasia ?? '', 'pt-BR')
        || (b.mesesDesdeManutencao ?? 0) - (a.mesesDesdeManutencao ?? 0));
    }
    return lista;
  }

  // ------------------------------------------------------------ filtro por situação

  /** opções do select "Situação" (cabeçalho da tabela), em grupos */
  readonly opcoesFiltroAndamento: { codigo: FiltroSituacao; nome: string }[] = [
    { codigo: 'ANDAMENTO', nome: 'Todos em andamento' },
    { codigo: 'RETORNO', nome: 'Retorno vencido / hoje' },
    ...RESULTADOS_CONTATO.filter(r => r.grupo === 'ANDAMENTO')
      .map(r => ({ codigo: `R:${r.codigo}` as FiltroSituacao, nome: r.nome })),
  ];

  readonly opcoesFiltroRejeitado: { codigo: FiltroSituacao; nome: string }[] = [
    { codigo: 'REJEITADO', nome: 'Todos rejeitados' },
    ...RESULTADOS_CONTATO.filter(r => r.grupo === 'REJEITADO')
      .map(r => ({ codigo: `R:${r.codigo}` as FiltroSituacao, nome: r.nome })),
  ];

  private passaNoFiltro(n: NobreakBateriaVencida, filtro: FiltroSituacao): boolean {
    if (filtro === 'TODOS') return true;
    if (filtro === 'RETORNO') return this.retornoVencido(n);
    if (filtro.startsWith('R:')) {
      return (n.situacao === 'ANDAMENTO' || n.situacao === 'REJEITADO') && n.equipResultado === filtro.substring(2);
    }
    return n.situacao === filtro;
  }

  get filtroAtivo(): boolean {
    return this.filtroSituacao !== 'TODOS';
  }

  limparFiltroSituacao(): void {
    this.filtroSituacao = 'TODOS';
  }

  qtNoFiltro(filtro: FiltroSituacao): number {
    return this.resultado.filter(n => this.passaNoFiltro(n, filtro)).length;
  }

  /** em andamento com data de retorno hoje ou já passada */
  retornoVencido(n: NobreakBateriaVencida): boolean {
    return n.situacao === 'ANDAMENTO' && !!n.equipDataRetorno && n.equipDataRetorno <= this.hojeIso();
  }

  /** cliente contatado nos últimos N dias (aviso para não ligar de novo) */
  contatadoRecentemente(dataHoraIso: string | null | undefined): boolean {
    if (!dataHoraIso) return false;
    const limite = new Date();
    limite.setDate(limite.getDate() - this.diasAvisoRecente);
    return new Date(dataHoraIso) >= limite;
  }

  classeSituacao(situacao: SituacaoProspeccao | null | undefined): string {
    switch (situacao) {
      case 'CLIENTE_CONTATADO': return 'cc-sit-cliente';
      case 'ANDAMENTO': return 'cc-sit-andamento';
      case 'REJEITADO': return 'cc-sit-rejeitado';
      default: return 'cc-sit-sem';
    }
  }

  nomeResultado(codigo: string | null | undefined): string {
    return this.resultadosContato.find(r => r.codigo === codigo)?.nome ?? (codigo ?? '');
  }

  grupoResultado(codigo: string | null | undefined): string {
    return this.resultadosContato.find(r => r.codigo === codigo)?.grupo ?? '';
  }

  textoSituacao(n: NobreakBateriaVencida): string {
    switch (n.situacao) {
      case 'ANDAMENTO':
      case 'REJEITADO':
        return this.nomeResultado(n.equipResultado);
      case 'CLIENTE_CONTATADO':
        return 'Cliente contatado';
      default:
        return 'Sem contato';
    }
  }

  dicaSituacao(n: NobreakBateriaVencida): string {
    const partes: string[] = [];
    if (n.equipResultado) {
      partes.push(`Este equipamento: ${this.nomeResultado(n.equipResultado)} em ${this.dataHoraBr(n.equipUltimoContato)} por ${n.equipOperador}`);
      if (n.equipDataRetorno) partes.push(`Retorno: ${this.dataBr(n.equipDataRetorno)}`);
    }
    if (n.clienteUltimoContato) {
      partes.push(`Último contato com o cliente: ${this.dataHoraBr(n.clienteUltimoContato)} por ${n.clienteUltimoOperador}`);
      if (!n.equipResultado) partes.push('Este equipamento ainda não foi tratado em nenhum contato.');
    }
    return partes.length ? partes.join('\n') : 'Nenhum contato desde a última manutenção.';
  }

  get qtClientesNoResultado(): number {
    return new Set(this.resultado.map(r => r.codcli)).size;
  }

  // ------------------------------------------------------------ detalhamento

  abrirDetalhe(item: NobreakBateriaVencida): void {
    this.itemDetalhe = item;
    this.detalheAberto = true;
    this.clienteDetalhe = null;
    this.historico = [];
    this.erroDetalhe = '';
    this.carregandoDetalhe = true;

    let pendentes = 2;
    const concluir = () => { if (--pendentes === 0) this.carregandoDetalhe = false; };

    this.osService.getClientePorId(item.codcli).subscribe({
      next: (cli) => { this.clienteDetalhe = cli; concluir(); },
      error: () => { this.erroDetalhe = 'Não foi possível carregar os dados do cliente.'; concluir(); }
    });

    this.prospeccaoService.buscarHistoricoEquipamento(item.ultimaOs).subscribe({
      next: (hist) => { this.historico = hist ?? []; concluir(); },
      error: () => { this.erroDetalhe = 'Não foi possível carregar o histórico do equipamento.'; concluir(); }
    });

    this.formContatoAberto = false;
    this.erroContato = '';
    this.carregarContatos(item.codcli);
  }

  fecharDetalhe(): void {
    this.detalheAberto = false;
    this.itemDetalhe = null;
    this.formContatoAberto = false;
  }

  // ------------------------------------------------------------ contatos do telemarketing

  carregarContatos(codcli: number): void {
    this.contatos = [];
    this.carregandoContatos = true;
    this.prospeccaoService.listarContatos(codcli).subscribe({
      next: (lista) => { this.contatos = lista ?? []; this.carregandoContatos = false; },
      error: () => {
        this.carregandoContatos = false;
        this.erroContato = 'Não foi possível carregar os contatos (as tabelas de contato já foram criadas no banco?).';
      }
    });
  }

  private contatoVazio(): ContatoProspeccao {
    return { codcli: 0, operador: '', canal: 'TELEFONE', pessoaContatada: '', observacao: '', dataRetorno: null, equipamentos: [] };
  }

  /** Abre o formulário com todos os nobreaks vencidos do cliente (desta busca); o equipamento aberto já vem marcado. */
  abrirFormContato(): void {
    if (!this.itemDetalhe) return;
    const operadorAnterior = this.novoContato.operador; // mantém o operador entre um contato e outro
    this.novoContato = { ...this.contatoVazio(), codcli: this.itemDetalhe.codcli, operador: operadorAnterior };
    this.equipamentosNoContato = this.resultado
      .filter(n => n.codcli === this.itemDetalhe!.codcli)
      .map(n => ({ item: n, marcado: n.chaveEquip === this.itemDetalhe!.chaveEquip, resultado: '' }));
    this.resultadoParaTodos = '';
    this.erroContato = '';
    this.formContatoAberto = true;
  }

  cancelarFormContato(): void {
    this.formContatoAberto = false;
    this.erroContato = '';
  }

  aplicarResultadoATodos(): void {
    if (!this.resultadoParaTodos) return;
    this.equipamentosNoContato.filter(e => e.marcado).forEach(e => e.resultado = this.resultadoParaTodos);
  }

  get qtEquipamentosMarcados(): number {
    return this.equipamentosNoContato.filter(e => e.marcado).length;
  }

  salvarContato(): void {
    this.erroContato = '';
    if (!this.novoContato.operador) {
      this.erroContato = 'Escolha o operador (atendente).';
      return;
    }
    const marcados = this.equipamentosNoContato.filter(e => e.marcado);
    if (marcados.some(e => !e.resultado)) {
      this.erroContato = 'Escolha o resultado de cada equipamento marcado.';
      return;
    }
    const exigeRetorno = marcados.some(e => e.resultado === 'PEDIU_RETORNO');
    if (exigeRetorno && !this.novoContato.dataRetorno) {
      this.erroContato = 'Informe a data de retorno (o cliente pediu retorno).';
      return;
    }

    const contato: ContatoProspeccao = {
      ...this.novoContato,
      dataRetorno: this.novoContato.dataRetorno || null,
      equipamentos: marcados.map(e => ({
        chaveEquip: e.item.chaveEquip,
        osReferencia: e.item.ultimaOs,
        marca: e.item.marca,
        modelo: e.item.modelo,
        serial: e.item.identificadoPor === 'SERIAL' ? e.item.serial : '',
        resultado: e.resultado,
      })),
    };

    this.salvandoContato = true;
    this.prospeccaoService.registrarContato(contato).subscribe({
      next: (gravado) => {
        this.salvandoContato = false;
        this.formContatoAberto = false;
        this.atualizarSituacaoLocal(gravado, marcados);
        this.carregarContatos(contato.codcli);
      },
      error: (erro) => {
        this.salvandoContato = false;
        this.erroContato = typeof erro?.error === 'string' && erro.error
          ? erro.error
          : 'Erro ao gravar o contato. Verifique se o backend está rodando e se as tabelas foram criadas.';
      }
    });
  }

  /** Reflete o contato gravado na tabela, sem refazer a busca. */
  private atualizarSituacaoLocal(gravado: ContatoProspeccao, marcados: EquipamentoNoContato[]): void {
    const dataHora = gravado?.dataHora ?? this.agoraIso();
    for (const n of this.resultado.filter(r => r.codcli === gravado.codcli)) {
      n.clienteUltimoContato = dataHora;
      n.clienteUltimoOperador = gravado.operador;
      if (n.situacao === 'SEM_CONTATO') n.situacao = 'CLIENTE_CONTATADO';
    }
    for (const e of marcados) {
      const n = e.item;
      n.equipResultado = e.resultado;
      n.equipUltimoContato = dataHora;
      n.equipOperador = gravado.operador;
      n.equipDataRetorno = gravado.dataRetorno ?? null;
      n.situacao = this.grupoResultado(e.resultado) === 'REJEITADO' ? 'REJEITADO' : 'ANDAMENTO';
    }
  }

  /** contato com o cliente feito há menos de N dias (aviso no formulário) */
  get avisoContatoRecente(): ContatoProspeccao | null {
    const ultimo = this.contatos[0];
    return ultimo && this.contatadoRecentemente(ultimo.dataHora) ? ultimo : null;
  }

  nomeCanal(codigo: string | null | undefined): string {
    return this.canais.find(c => c.codigo === codigo)?.nome ?? (codigo ?? '');
  }

  iconeCanal(codigo: string | null | undefined): string {
    return this.canais.find(c => c.codigo === codigo)?.icone ?? 'bi-chat';
  }

  @HostListener('document:keydown.escape')
  aoPressionarEsc(): void {
    if (this.detalheAberto) this.fecharDetalhe();
  }

  // ------------------------------------------------------------ formatação

  /** 'yyyy-MM-ddTHH:mm' -> 'dd/MM/yyyy HH:mm' */
  dataHoraBr(iso: string | null | undefined): string {
    if (!iso) return '';
    const hora = iso.length >= 16 ? iso.substring(11, 16) : '';
    return `${this.dataBr(iso)} ${hora}`.trim();
  }

  private hojeIso(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private agoraIso(): string {
    const d = new Date();
    return `${this.hojeIso()}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  /** 'yyyy-MM-dd' -> 'dd/MM/yyyy' (sem DatePipe, que deslocaria o dia por causa do fuso) */
  dataBr(iso: string | null | undefined): string {
    if (!iso || iso.length < 10) return '';
    const [ano, mes, dia] = iso.substring(0, 10).split('-');
    return `${dia}/${mes}/${ano}`;
  }

  private static readonly FORMATO_MOEDA = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  /** Texto do banco ('5685,20', '3048', '1.234,50', '154.00') -> 'R$ 5.685,20' */
  moeda(valor: string | number | null | undefined): string {
    if (valor == null || valor === '') return '';
    let texto = valor.toString().trim().replace(/[^\d,.\-]/g, '');
    if (texto.includes(',')) {
      // vírgula é o separador decimal; pontos são separadores de milhar
      texto = texto.replace(/\./g, '').replace(',', '.');
    }
    const numero = Number(texto);
    return isNaN(numero) ? valor.toString() : FormProspeccaoComponent.FORMATO_MOEDA.format(numero);
  }

  nomePotencia(va: number | null | undefined): string {
    if (va == null) return '';
    const modelo = this.modelos.find(m => m.va === va);
    return modelo ? modelo.nome : `${va} VA`;
  }

  enderecoCompleto(cli: Cliente | null): string {
    if (!cli) return '';
    return [cli.ruanum, cli.num, cli.bairro, cli.cidade, cli.cep]
      .map(p => (p ?? '').toString().trim())
      .filter(p => p.length > 0)
      .join(', ');
  }

  telefones(cli: Cliente | null): string {
    if (!cli) return '';
    return [cli.fonefixo, cli.fone, cli.celular2]
      .map(f => (f ?? '').toString().trim())
      .filter(f => f.length > 0)
      .join(' / ');
  }

  textoOuTraco(valor: string | null | undefined): string {
    const v = (valor ?? '').toString().trim();
    return v.length > 0 ? v : '—';
  }
}
