import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrotaCliente, FrotaNobreak, SituacaoBanco } from '../../../modelo/Etiqueta';
import { LegendaBateriaComponent } from '../legenda-bateria/legenda-bateria.component';

/**
 * Botão "Nobreaks deste cliente" + lista com a situação dos bancos de baterias
 * (ATIVO < 18 meses, ATENÇÃO 18 a < 24, VENCIDO >= 24; critérios da prospecção),
 * filtros com contagem, "mostrar mais" e pedido de orçamento pelo WhatsApp com a mensagem pronta.
 *
 * Usado na página pública do QR (/e/:codigo) e na lista do login externo (/login/lista/:codcli).
 * Só aparece quando o cliente tem nobreaks.
 */
@Component({
  selector: 'app-frota-nobreaks',
  standalone: true,
  imports: [CommonModule, LegendaBateriaComponent],
  templateUrl: './frota-nobreaks.component.html',
  styleUrl: './frota-nobreaks.component.css'
})
export class FrotaNobreaksComponent {

  static readonly WHATSAPP = '553732126708';   // (37) 3212-6708
  static readonly POR_PAGINA = 30;
  static readonly MAX_NA_MENSAGEM = 20;

  @Input() frota: FrotaCliente | null = null;
  /** lista já aberta ao carregar */
  @Input() aberta = false;
  @Input() rotulo = 'Nobreaks deste cliente';
  /** botão em cor de evidência (laranja) em vez do azul padrão */
  @Input() destaque = false;
  /** observação curta exibida logo abaixo do botão (ex.: explicação de um asterisco no rótulo) */
  @Input() nota = '';
  /** avisa quem usa o componente quando a lista abre/fecha (permite [(aberta)] e acordeão exclusivo) */
  @Output() abertaChange = new EventEmitter<boolean>();

  filtro: 'TODOS' | SituacaoBanco = 'TODOS';
  limite = FrotaNobreaksComponent.POR_PAGINA;

  alternar(): void {
    this.aberta = !this.aberta;
    this.abertaChange.emit(this.aberta);
  }

  escolherFiltro(f: 'TODOS' | SituacaoBanco): void {
    this.filtro = f;
    this.limite = FrotaNobreaksComponent.POR_PAGINA;
  }

  nobreaksFiltrados(): FrotaNobreak[] {
    const lista = this.frota?.nobreaks ?? [];
    return this.filtro === 'TODOS' ? lista : lista.filter(n => n.situacao === this.filtro);
  }

  nobreaksVisiveis(): FrotaNobreak[] {
    return this.nobreaksFiltrados().slice(0, this.limite);
  }

  mostrarMais(): void {
    this.limite += FrotaNobreaksComponent.POR_PAGINA;
  }

  rotuloSituacao(s: SituacaoBanco): string {
    return s === 'VENCIDO' ? 'ANÁLISE TÉCNICA GRATUITA' : s === 'ATENCAO' ? 'TESTAR' : 'ATIVO';
  }

  /** "há 27 meses" / "há 1 mês" / "este mês" */
  tempoDesde(meses: number): string {
    if (meses <= 0) return 'este mês';
    return meses === 1 ? 'há 1 mês' : `há ${meses} meses`;
  }

  /** yyyy-MM-dd -> dd/MM/yyyy */
  dataBr(iso: string | null | undefined): string {
    if (!iso) return '-';
    const [a, m, d] = iso.substring(0, 10).split('-');
    return `${d}/${m}/${a}`;
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
    const max = FrotaNobreaksComponent.MAX_NA_MENSAGEM;
    const linhas = lista.slice(0, max).map(n => {
      const id = n.serial ? ` - série ${n.serial}` : n.patrimonio ? ` - patrimônio ${n.patrimonio}` : '';
      return `• ${n.marca} ${n.modelo}${id} - OS ${n.ultimaOs}`;
    });
    if (lista.length > max) linhas.push(`• e mais ${lista.length - max} nobreak(s)`);
    const codigo = this.frota?.codcli != null ? ` (cód. cliente ${this.frota.codcli})` : '';
    const empresa = this.frota?.cliente ? ` da ${this.frota.cliente}${codigo}` : codigo;
    const texto = `Olá! Sou${empresa} e gostaria de um orçamento para a troca das baterias `
      + `dos nobreaks ${situacao} (${lista.length}):\n${linhas.join('\n')}`;
    return `https://wa.me/${FrotaNobreaksComponent.WHATSAPP}?text=${encodeURIComponent(texto)}`;
  }
}
