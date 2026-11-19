import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EtiquetaService } from '../../../servico/etiqueta.service';
import { EquipamentoPublico, FrotaCliente, FrotaNobreak, PassagemPublica, SituacaoBanco } from '../../../modelo/Etiqueta';

/**
 * Página pública aberta pelo QR Code da etiqueta do equipamento (sem login).
 * Rota: /e/:codigo   ex.: https://app.somonitores.tec.br/e/97eVe7BEDADS
 * Mostra a última manutenção, as garantias e o histórico. Nunca mostra valores.
 * Botão "Nobreaks deste cliente": frota do cliente com a situação do banco de baterias
 * (ATIVO < 18 meses, ATENÇÃO 18 a < 24, VENCIDO >= 24; critérios da prospecção) e pedido de
 * orçamento pelo WhatsApp com a mensagem pronta.
 */
@Component({
  selector: 'app-pag-equipamento-publico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pag-equipamento-publico.component.html',
  styleUrl: './pag-equipamento-publico.component.css'
})
export class PagEquipamentoPublicoComponent implements OnInit {

  dados: EquipamentoPublico | null = null;
  carregando = true;
  naoEncontrada = false;
  erro = false;
  /** OS abertas (detalhes visíveis) no histórico */
  abertas = new Set<number>();

  private hoje = new Date().toISOString().substring(0, 10);

  // ---------- frota de nobreaks do cliente ----------
  static readonly WHATSAPP = '553732126708';   // (37) 3212-6708
  static readonly POR_PAGINA = 30;
  static readonly MAX_NA_MENSAGEM = 20;

  frota: FrotaCliente | null = null;
  frotaAberta = false;
  filtro: 'TODOS' | SituacaoBanco = 'TODOS';
  limite = PagEquipamentoPublicoComponent.POR_PAGINA;
  private codigo = '';

  constructor(private route: ActivatedRoute, private servico: EtiquetaService) { }

  ngOnInit(): void {
    const codigo = this.route.snapshot.paramMap.get('codigo') || '';
    this.codigo = codigo;
    // ?frota=1 abre a página já com a lista de nobreaks expandida
    this.frotaAberta = this.route.snapshot.queryParamMap.get('frota') === '1';
    this.servico.consultarEquipamento(codigo).subscribe({
      next: (d) => {
        this.dados = d;
        this.carregando = false;
        this.carregarFrota();
      },
      error: (e) => {
        this.carregando = false;
        if (e?.status === 404) this.naoEncontrada = true;
        else this.erro = true;
      }
    });
  }

  alternar(p: PassagemPublica): void {
    if (this.abertas.has(p.os)) this.abertas.delete(p.os);
    else this.abertas.add(p.os);
  }

  /** garantia ainda vale hoje? */
  vigente(ate: string | null | undefined): boolean {
    return !!ate && ate >= this.hoje;
  }

  /** yyyy-MM-dd -> dd/MM/yyyy */
  dataBr(iso: string | null | undefined): string {
    if (!iso) return '-';
    const [a, m, d] = iso.substring(0, 10).split('-');
    return `${d}/${m}/${a}`;
  }

  /** status interno -> texto para o cliente */
  situacao(p: PassagemPublica): string {
    const s = (p.status || '').toUpperCase();
    if (s === 'FECHADA') return 'Concluída';
    if (s === 'BAIXA') return 'Encerrada';
    return 'Em andamento';
  }

  /** o card "Estado da bateria" só faz sentido para nobreak */
  ehNobreak(): boolean {
    return (this.dados?.equipamento || '').toUpperCase().includes('NOBREAK');
  }

  descricaoEquipamento(): string {
    if (!this.dados) return '';
    return [this.dados.equipamento, this.dados.marca, this.dados.modelo].filter(x => !!x).join(' ');
  }

  // ---------- frota de nobreaks do cliente ----------

  /** carrega em segundo plano: o botão só aparece se o cliente tiver nobreaks */
  private carregarFrota(): void {
    this.servico.consultarFrota(this.codigo).subscribe({
      next: (f) => this.frota = f,
      error: () => this.frota = null   // sem a lista, a página continua normal
    });
  }

  alternarFrota(): void {
    this.frotaAberta = !this.frotaAberta;
  }

  escolherFiltro(f: 'TODOS' | SituacaoBanco): void {
    this.filtro = f;
    this.limite = PagEquipamentoPublicoComponent.POR_PAGINA;
  }

  nobreaksFiltrados(): FrotaNobreak[] {
    const lista = this.frota?.nobreaks ?? [];
    return this.filtro === 'TODOS' ? lista : lista.filter(n => n.situacao === this.filtro);
  }

  nobreaksVisiveis(): FrotaNobreak[] {
    return this.nobreaksFiltrados().slice(0, this.limite);
  }

  mostrarMais(): void {
    this.limite += PagEquipamentoPublicoComponent.POR_PAGINA;
  }

  rotuloSituacao(s: SituacaoBanco): string {
    return s === 'VENCIDO' ? 'Vencido' : s === 'ATENCAO' ? 'Atenção' : 'Ativo';
  }

  /** "há 27 meses" / "há 1 mês" / "este mês" */
  tempoDesde(meses: number): string {
    if (meses <= 0) return 'este mês';
    return meses === 1 ? 'há 1 mês' : `há ${meses} meses`;
  }

  /** nobreaks que entram no pedido: os vencidos; se não houver, os em atenção */
  private paraOrcamento(): { lista: FrotaNobreak[]; situacao: string } {
    const todos = this.frota?.nobreaks ?? [];
    const vencidos = todos.filter(n => n.situacao === 'VENCIDO');
    if (vencidos.length) return { lista: vencidos, situacao: 'com bateria vencida' };
    const atencao = todos.filter(n => n.situacao === 'ATENCAO');
    return { lista: atencao, situacao: 'com bateria perto de vencer' };
  }

  temOrcamento(): boolean {
    return this.paraOrcamento().lista.length > 0;
  }

  /** link do WhatsApp com a mensagem pronta (lista limitada para o link não ficar enorme) */
  linkWhatsapp(): string {
    const { lista, situacao } = this.paraOrcamento();
    const max = PagEquipamentoPublicoComponent.MAX_NA_MENSAGEM;
    const linhas = lista.slice(0, max).map(n => {
      const id = n.serial ? ` - série ${n.serial}` : n.patrimonio ? ` - patrimônio ${n.patrimonio}` : '';
      return `• ${n.marca} ${n.modelo}${id} - OS ${n.ultimaOs}`;
    });
    if (lista.length > max) linhas.push(`• e mais ${lista.length - max} nobreak(s)`);
    const codigo = this.frota?.codcli != null ? ` (cód. cliente ${this.frota.codcli})` : '';
    const empresa = this.frota?.cliente ? ` da ${this.frota.cliente}${codigo}` : codigo;
    const texto = `Olá! Sou${empresa} e gostaria de um orçamento para a troca das baterias `
      + `dos nobreaks ${situacao} (${lista.length}):\n${linhas.join('\n')}`;
    return `https://wa.me/${PagEquipamentoPublicoComponent.WHATSAPP}?text=${encodeURIComponent(texto)}`;
  }
}
