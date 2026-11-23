import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EtiquetaService } from '../../../servico/etiqueta.service';
import { EquipamentoPublico, FrotaCliente, PassagemPublica, SituacaoBanco } from '../../../modelo/Etiqueta';
import { FrotaNobreaksComponent } from '../../FROTA_NOBREAKS/frota-nobreaks/frota-nobreaks.component';
import { LegendaBateriaComponent } from '../../FROTA_NOBREAKS/legenda-bateria/legenda-bateria.component';

/**
 * Página pública aberta pelo QR Code da etiqueta do equipamento (sem login).
 * Rota: /e/:codigo   ex.: https://status.somonitores.tec.br/e/97eVe7BEDADS
 * Mostra a última manutenção, as garantias e o histórico. Nunca mostra valores.
 * Botão "Nobreaks deste cliente": componente compartilhado FrotaNobreaksComponent
 * (o mesmo usado na lista do login externo).
 */
@Component({
  selector: 'app-pag-equipamento-publico',
  standalone: true,
  imports: [CommonModule, FrotaNobreaksComponent, LegendaBateriaComponent],
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

  // ---------- frota de nobreaks do cliente (componente app-frota-nobreaks) ----------
  frota: FrotaCliente | null = null;
  private codigo = '';

  /** acordeão exclusivo: no máximo um painel aberto (null = página abre só com os dois botões) */
  painel: 'historico' | 'frota' | null = null;

  constructor(private route: ActivatedRoute, private servico: EtiquetaService) { }

  ngOnInit(): void {
    const codigo = this.route.snapshot.paramMap.get('codigo') || '';
    this.codigo = codigo;
    // ?frota=1 abre a página já com a lista de nobreaks expandida
    if (this.route.snapshot.queryParamMap.get('frota') === '1') this.painel = 'frota';
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

  /** botão verde "Histórico do nobreak lido no QR Code" */
  alternarHistorico(): void {
    this.painel = this.painel === 'historico' ? null : 'historico';
  }

  /** botão laranja (componente da frota) abriu/fechou: abrir um fecha o outro */
  aoAlternarFrota(aberta: boolean): void {
    if (aberta) this.painel = 'frota';
    else if (this.painel === 'frota') this.painel = null;
  }

  /** "nobreak" quando for nobreak; nos demais aparelhos (monitor, estabilizador) "equipamento" */
  nomeAparelho(): string {
    return this.ehNobreak() ? 'nobreak' : 'equipamento';
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

  /** OS da etiqueta lida (item do histórico marcado osDaEtiqueta; senão a última manutenção) */
  osDaEtiqueta(): number | null {
    const p = this.dados?.historico?.find(h => h.osDaEtiqueta);
    return p?.os ?? this.dados?.ultimaManutencao?.os ?? null;
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

  /** texto para o cliente (mesmo do componente da frota): ATIVO / TESTAR / ANÁLISE TÉCNICA */
  rotuloSituacao(s: SituacaoBanco): string {
    return s === 'VENCIDO' ? 'ANÁLISE TÉCNICA' : s === 'ATENCAO' ? 'TESTAR' : 'ATIVO';
  }

  /** "há 27 meses" / "há 1 mês" / "este mês" */
  tempoDesde(meses: number): string {
    if (meses <= 0) return 'este mês';
    return meses === 1 ? 'há 1 mês' : `há ${meses} meses`;
  }
}
