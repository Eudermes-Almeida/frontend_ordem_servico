import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EtiquetaService } from '../../../servico/etiqueta.service';
import { EquipamentoPublico, PassagemPublica } from '../../../modelo/Etiqueta';

/**
 * Página pública aberta pelo QR Code da etiqueta do equipamento (sem login).
 * Rota: /e/:codigo   ex.: https://app.somonitores.tec.br/e/97eVe7BEDADS
 * Mostra a última manutenção, as garantias e o histórico. Nunca mostra valores.
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

  constructor(private route: ActivatedRoute, private servico: EtiquetaService) { }

  ngOnInit(): void {
    const codigo = this.route.snapshot.paramMap.get('codigo') || '';
    this.servico.consultarEquipamento(codigo).subscribe({
      next: (d) => {
        this.dados = d;
        this.carregando = false;
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

  descricaoEquipamento(): string {
    if (!this.dados) return '';
    return [this.dados.equipamento, this.dados.marca, this.dados.modelo].filter(x => !!x).join(' ');
  }
}
