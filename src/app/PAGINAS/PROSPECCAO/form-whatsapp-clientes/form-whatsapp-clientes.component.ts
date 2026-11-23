import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged, forkJoin, of, catchError, map } from 'rxjs';
import { Cliente } from '../../../modelo/Cliente';
import { ClienteBateriaVencida, ContatoProspeccao, MODELOS_NOBREAK, PRAZOS_BATERIA } from '../../../modelo/Prospeccao';
import { OrdemservicoService } from '../../../servico/ordemservico.service';
import { ProspeccaoService } from '../../../servico/prospeccao.service';
import { ParametrosService } from '../../../servico/parametros.service';

/** linha da lista: um cliente */
interface LinhaCliente {
  c: ClienteBateriaVencida;
  /** número pronto para o wa.me (55 + DDD + número) ou null se não dá para enviar */
  numero: string | null;
  marcado: boolean;
  /** WhatsApp aberto nesta sessão da tela */
  enviado: boolean;
}

/** aba "Acompanhar envios": um cliente que recebeu mensagem no período */
interface ClienteEnviado {
  codcli: number;
  fantasia: string;
  contato: string;
  mensagens: number;
  /** yyyy-MM-ddTHH:mm */
  ultimoEnvio: string;
  operadores: string[];
}

/** item da fila de envio */
interface ItemFila {
  linha: LinhaCliente;
  url: string | null;
  erro: string;
  situacao: 'PENDENTE' | 'ABERTO' | 'PULADO';
}

/**
 * PROSPECÇÃO - INTERAÇÃO POR WHATSAPP
 * Mesmos filtros da tela "Nobreaks – Baterias Vencidas", mas um cliente por linha.
 * Marca os clientes e "Enviar" abre uma fila: para cada cliente o WhatsApp abre com a mensagem
 * pronta (link wa.me) e a atendente só confirma o envio. Cada envio fica registrado como contato
 * (canal WHATSAPP) na prospecção. Com "Número de teste" preenchido, a mensagem (com contato e
 * link reais) vai para o número de teste e nada é registrado.
 */
@Component({
  selector: 'app-form-whatsapp-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form-whatsapp-clientes.component.html',
  styleUrls: [
    '../form-prospeccao/form-prospeccao.component.css',   // mesmo visual da tela de prospecção
    './form-whatsapp-clientes.component.css',
  ]
})
export class FormWhatsappClientesComponent implements OnInit, OnDestroy {

  static readonly CHAVE_TESTE = 'whatsappNumeroTeste';
  static readonly CHAVE_OPERADOR = 'whatsappOperador';
  /** início da observação gravada em cada envio desta tela (identifica as mensagens da campanha) */
  static readonly MARCA_ENVIO = 'Mensagem "Interação por WhatsApp"';

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
  linhas: LinhaCliente[] = [];
  pesquisou = false;
  carregando = false;
  mensagemErro = '';
  ordenacao: 'cliente' | 'quantidade' = 'cliente';

  ///// ENVIO
  atendentes: string[] = [];
  operador = '';
  numeroTeste = '';

  fila: ItemFila[] = [];
  filaAberta = false;
  posicao = 0;
  preparandoFila = false;

  ///// ABAS
  aba: 'enviar' | 'acompanhar' = 'enviar';

  ///// ACOMPANHAR ENVIOS (mensagens desta tela registradas na prospecção)
  envInicio = '';
  envFim = '';
  envOperador = '';
  envClientes: ClienteEnviado[] = [];
  envTotalMensagens = 0;
  envPorOperador: { operador: string; mensagens: number; clientes: number }[] = [];
  envPesquisou = false;
  envCarregando = false;
  envErro = '';

  private subs = new Subscription();

  constructor(
    private prospeccaoService: ProspeccaoService,
    private osService: OrdemservicoService,
    private parametrosService: ParametrosService,
  ) { }

  ngOnInit(): void {
    this.numeroTeste = this.ler(FormWhatsappClientesComponent.CHAVE_TESTE);
    const operadorSalvo = this.ler(FormWhatsappClientesComponent.CHAVE_OPERADOR);

    this.parametrosService.getAtendentes().subscribe({
      next: (lista) => {
        this.atendentes = (lista ?? []).map(a => (a.valor ?? '').trim()).filter(v => v.length > 0);
        this.operador = this.atendentes.find(a => a === operadorSalvo)
          ?? this.atendentes.find(a => a.toUpperCase().includes('ALESSANDRA'))
          ?? this.atendentes[0] ?? '';
      },
      error: () => this.atendentes = []
    });

    this.subs.add(
      this.formulario.controls.razaosocial.valueChanges
        .pipe(debounceTime(350), distinctUntilChanged())
        .subscribe(valor => this.buscarClientes(valor))
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // ------------------------------------------------------------ cliente (igual à tela de prospecção)

  buscarClientes(valor: string): void {
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
    this.prospeccaoService.buscarClientesBateriaVencida(codcli, Number(f.meses), potMin, potMax).subscribe({
      next: (dados) => {
        this.linhas = (dados ?? []).map(c => ({ c, numero: numeroWhatsapp(c.whatsapp), marcado: false, enviado: false }));
        this.pesquisou = true;
        this.carregando = false;
      },
      error: (erro) => {
        this.linhas = [];
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
    this.linhas = [];
    this.pesquisou = false;
    this.mensagemErro = '';
  }

  get linhasOrdenadas(): LinhaCliente[] {
    const l = [...this.linhas];
    if (this.ordenacao === 'quantidade') {
      l.sort((a, b) => b.c.qtNobreaks - a.c.qtNobreaks || (a.c.fantasia || '').localeCompare(b.c.fantasia || ''));
    } else {
      l.sort((a, b) => (a.c.fantasia || '').localeCompare(b.c.fantasia || ''));
    }
    return l;
  }

  // ------------------------------------------------------------ marcação

  get linhasValidas(): LinhaCliente[] {
    return this.linhas.filter(l => l.numero);
  }

  get marcados(): LinhaCliente[] {
    return this.linhas.filter(l => l.marcado && l.numero);
  }

  get qtNobreaksMarcados(): number {
    return this.marcados.reduce((s, l) => s + l.c.qtNobreaks, 0);
  }

  get todosMarcados(): boolean {
    const v = this.linhasValidas;
    return v.length > 0 && v.every(l => l.marcado);
  }

  marcarTodos(marcar: boolean): void {
    this.linhasValidas.forEach(l => l.marcado = marcar);
  }

  // ------------------------------------------------------------ modo teste / operador

  get numeroTesteNormalizado(): string | null {
    return numeroWhatsapp(this.numeroTeste);
  }

  get modoTeste(): boolean {
    return this.numeroTeste.trim().length > 0;
  }

  salvarNumeroTeste(): void {
    this.gravar(FormWhatsappClientesComponent.CHAVE_TESTE, this.numeroTeste.trim());
  }

  salvarOperador(): void {
    this.gravar(FormWhatsappClientesComponent.CHAVE_OPERADOR, this.operador);
  }

  get podeEnviar(): boolean {
    return this.marcados.length > 0 && !!this.operador
      && (!this.modoTeste || !!this.numeroTesteNormalizado) && !this.preparandoFila;
  }

  // ------------------------------------------------------------ mensagem

  /**
   * Texto definido pelo usuário (23/11/2026), com uma linha em branco entre os blocos.
   * Sem contato: "Olá!".
   */
  mensagem(contato: string | null, url: string): string {
    const nome = nomeProprio(contato);
    const remetente = nomeProprio(this.operador) || 'Alessandra';
    return [
      nome ? `Olá, ${nome}!` : 'Olá!',
      'Tudo bem?',
      `Aqui é a ${remetente}, da Só Monitores & Nobreaks.`,
      // *texto* = negrito no WhatsApp (precisa ficar numa linha só)
      'Temos uma novidade para facilitar o seu controle:\n'
        + '*agora você pode acompanhar online o status do banco de baterias de todos os seus nobreaks '
        + 'que já passaram por manutenção conosco.*',
      `Acesse o portal pelo link abaixo para conferir:\n${url}`,
      'Qualquer dúvida, estou à disposição!',
      'Muito obrigada!',
    ].join('\n\n');
  }

  /** mensagem para a prévia na tela: mostra o *negrito* do WhatsApp como negrito */
  previaHtml(texto: string): string {
    const seguro = texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return seguro.replace(/\*([^*\n]+)\*/g, '<strong>$1</strong>');
  }

  /** prévia da mensagem com o primeiro cliente marcado (ou um exemplo) */
  get previa(): string {
    const primeiro = this.marcados[0];
    return this.mensagem(primeiro ? primeiro.c.contato : 'Maria', '(link do cliente)');
  }

  // ------------------------------------------------------------ fila de envio

  /**
   * Prepara a fila: pega antes o link de cada cliente (assim o clique em "Abrir WhatsApp"
   * abre a janela na hora, sem o navegador bloquear como pop-up).
   */
  enviar(): void {
    if (!this.podeEnviar) return;
    const selecionados = [...this.marcados].sort((a, b) => (a.c.fantasia || '').localeCompare(b.c.fantasia || ''));
    this.preparandoFila = true;
    forkJoin(selecionados.map(l => this.prospeccaoService.gerarLinkCliente(l.c.codcli).pipe(
      map(link => ({ linha: l, url: link.url, erro: '', situacao: 'PENDENTE' as const })),
      catchError(() => of({ linha: l, url: null, erro: 'Não foi possível gerar o link deste cliente.', situacao: 'PENDENTE' as const }))
    ))).subscribe(itens => {
      this.fila = itens;
      this.posicao = 0;
      this.preparandoFila = false;
      this.filaAberta = true;
    });
  }

  get atual(): ItemFila | null {
    return this.fila[this.posicao] ?? null;
  }

  get qtAbertos(): number {
    return this.fila.filter(i => i.situacao === 'ABERTO').length;
  }

  get filaTerminada(): boolean {
    return this.posicao >= this.fila.length;
  }

  destinoAtual(): string | null {
    const item = this.atual;
    if (!item) return null;
    return this.modoTeste ? this.numeroTesteNormalizado : item.linha.numero;
  }

  /** abre o WhatsApp do cliente atual com a mensagem pronta e passa para o próximo */
  abrirWhatsapp(): void {
    const item = this.atual;
    const destino = this.destinoAtual();
    if (!item || !item.url || !destino) return;

    const texto = this.mensagem(item.linha.c.contato, item.url);
    // mesma janela nomeada: não acumula uma aba por cliente
    window.open(`https://wa.me/${destino}?text=${encodeURIComponent(texto)}`, 'whatsapp-prospeccao');

    item.situacao = 'ABERTO';
    item.linha.enviado = true;
    item.linha.marcado = false;
    if (!this.modoTeste) this.registrarEnvio(item);
    this.posicao++;
  }

  pular(): void {
    const item = this.atual;
    if (!item) return;
    item.situacao = 'PULADO';
    this.posicao++;
  }

  fecharFila(): void {
    this.filaAberta = false;
    this.fila = [];
    this.posicao = 0;
  }

  /** grava o envio como contato de prospecção (canal WHATSAPP) */
  private registrarEnvio(item: ItemFila): void {
    const c = item.linha.c;
    this.prospeccaoService.registrarContato({
      codcli: c.codcli,
      operador: this.operador,
      canal: 'WHATSAPP',
      pessoaContatada: (c.contato || '').trim(),
      observacao: `${FormWhatsappClientesComponent.MARCA_ENVIO} (status das baterias de ${c.qtNobreaks} nobreak(s)): ${item.url}`,
      dataRetorno: null,
      equipamentos: [],
    }).subscribe({
      next: (gravado) => c.ultimoWhatsapp = gravado?.dataHora ?? new Date().toISOString().substring(0, 16),
      error: () => item.erro = 'WhatsApp aberto, mas o envio não foi registrado na prospecção.'
    });
  }

  // ------------------------------------------------------------ acompanhar envios

  /** atalhos: hoje, últimos 7 dias, mês atual */
  periodoEnvios(tipo: 'hoje' | 'semana' | 'mes'): void {
    const hoje = new Date();
    const inicio = new Date(hoje);
    if (tipo === 'semana') inicio.setDate(hoje.getDate() - 6);
    if (tipo === 'mes') inicio.setDate(1);
    this.envInicio = isoLocal(inicio);
    this.envFim = isoLocal(hoje);
  }

  abrirAcompanhar(): void {
    this.aba = 'acompanhar';
    if (!this.envInicio || !this.envFim) {
      this.periodoEnvios('semana');
      this.buscarEnvios();
    }
  }

  get periodoEnviosInvalido(): boolean {
    return !this.envInicio || !this.envFim || this.envInicio > this.envFim;
  }

  /**
   * Mensagens enviadas por esta tela no período (contatos WHATSAPP cuja observação começa com
   * o texto gravado em registrarEnvio), agrupadas por cliente.
   */
  buscarEnvios(): void {
    this.envErro = '';
    if (this.periodoEnviosInvalido) {
      this.envErro = 'Informe a data inicial e a data final (a final não pode ser anterior à inicial).';
      return;
    }
    this.envCarregando = true;
    this.prospeccaoService.listarContatosPeriodo(this.envInicio, this.envFim, this.envOperador || null).subscribe({
      next: (lista) => {
        const envios = (lista ?? []).filter(c => c.canal === 'WHATSAPP'
          && (c.observacao || '').startsWith(FormWhatsappClientesComponent.MARCA_ENVIO));
        this.montarResumoEnvios(envios);
        this.envPesquisou = true;
        this.envCarregando = false;
      },
      error: (erro) => {
        this.montarResumoEnvios([]);
        this.envPesquisou = true;
        this.envCarregando = false;
        this.envErro = typeof erro?.error === 'string' && erro.error
          ? erro.error
          : 'Erro ao consultar o servidor. Verifique se o backend está rodando.';
      }
    });
  }

  private montarResumoEnvios(envios: ContatoProspeccao[]): void {
    const porCliente = new Map<number, ClienteEnviado>();
    const porOperador = new Map<string, { mensagens: number; clientes: Set<number> }>();
    for (const e of envios) {
      const c = porCliente.get(e.codcli) ?? {
        codcli: e.codcli, fantasia: e.fantasia || '', contato: e.pessoaContatada || '',
        mensagens: 0, ultimoEnvio: '', operadores: [],
      };
      c.mensagens++;
      if ((e.dataHora || '') > c.ultimoEnvio) c.ultimoEnvio = e.dataHora || '';
      if (e.operador && !c.operadores.includes(e.operador)) c.operadores.push(e.operador);
      porCliente.set(e.codcli, c);

      const op = porOperador.get(e.operador) ?? { mensagens: 0, clientes: new Set<number>() };
      op.mensagens++;
      op.clientes.add(e.codcli);
      porOperador.set(e.operador, op);
    }
    this.envClientes = [...porCliente.values()].sort((a, b) => b.ultimoEnvio.localeCompare(a.ultimoEnvio));
    this.envTotalMensagens = envios.length;
    this.envPorOperador = [...porOperador.entries()]
      .map(([operador, v]) => ({ operador, mensagens: v.mensagens, clientes: v.clientes.size }))
      .sort((a, b) => b.mensagens - a.mensagens);
  }

  /** yyyy-MM-ddTHH:mm -> dd/MM/yyyy HH:mm */
  dataHoraBr(iso: string | null | undefined): string {
    if (!iso) return '';
    return `${this.dataBr(iso)} ${iso.substring(11, 16)}`.trim();
  }

  // ------------------------------------------------------------ apoio

  /** yyyy-MM-ddTHH:mm -> dd/MM/yyyy */
  dataBr(iso: string | null | undefined): string {
    if (!iso) return '';
    const [a, m, d] = iso.substring(0, 10).split('-');
    return `${d}/${m}/${a}`;
  }

  /** "(37) 99999-9999" a partir de 5537999999999 */
  numeroFormatado(n: string | null): string {
    if (!n) return '';
    const local = n.startsWith('55') ? n.substring(2) : n;
    const ddd = local.substring(0, 2);
    const resto = local.substring(2);
    const corte = resto.length - 4;
    return `(${ddd}) ${resto.substring(0, corte)}-${resto.substring(corte)}`;
  }

  private ler(chave: string): string {
    try { return localStorage.getItem(chave) ?? ''; } catch { return ''; }
  }

  private gravar(chave: string, valor: string): void {
    try { localStorage.setItem(chave, valor); } catch { }
  }
}

/**
 * Número do cadastro -> formato do wa.me (55 + DDD + número), ou null se não dá para usar.
 * O campo às vezes tem mais de um número ("37 3212-6708 / 37 99999-9999"): prefere o celular
 * (DDD + 9 + 8 dígitos); se não houver, o primeiro número com DDD.
 */
export function numeroWhatsapp(campo: string | null | undefined): string | null {
  if (!campo) return null;
  const numeros: string[] = [];
  for (const parte of campo.split(/[\/,;|]| e | ou /i)) {
    let d = parte.replace(/\D/g, '');
    if (d.startsWith('0')) d = d.replace(/^0+/, '');          // 0 37 ... / 0xx
    if (d.length >= 12 && d.startsWith('55')) d = d.substring(2);
    if (d.length === 10 || d.length === 11) numeros.push(d);  // DDD + 8 ou 9 dígitos
  }
  const celular = numeros.find(d => d.length === 11 && d.charAt(2) === '9');
  const escolhido = celular ?? numeros[0];
  return escolhido ? '55' + escolhido : null;
}

/** Date -> yyyy-MM-dd no fuso local */
function isoLocal(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${dia}`;
}

/** "MARIA APARECIDA" -> "Maria Aparecida" */
function nomeProprio(s: string | null | undefined): string {
  const t = (s || '').trim().replace(/\s+/g, ' ');
  if (!t) return '';
  const minusculas = ['da', 'de', 'do', 'das', 'dos', 'e'];
  return t.toLowerCase().split(' ')
    .map((p, i) => i > 0 && minusculas.includes(p) ? p : p.charAt(0).toUpperCase() + p.substring(1))
    .join(' ');
}
