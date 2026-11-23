import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EtiquetaService } from '../../../servico/etiqueta.service';
import { FrotaCliente } from '../../../modelo/Etiqueta';
import { FrotaNobreaksComponent } from '../../FROTA_NOBREAKS/frota-nobreaks/frota-nobreaks.component';

/**
 * Página pública aberta pelo link da mensagem de WhatsApp (sem login).
 * Rota: /c/:codigo  (código fixo por cliente, tabela CLIENTE_LINK)
 * Abre direto no "Status baterias de TODOS nobreaks do cliente". Nunca mostra valores.
 */
@Component({
  selector: 'app-pag-cliente-publico',
  standalone: true,
  imports: [CommonModule, FrotaNobreaksComponent],
  templateUrl: './pag-cliente-publico.component.html',
  // mesmo visual da página do QR
  styleUrl: '../pag-equipamento-publico/pag-equipamento-publico.component.css'
})
export class PagClientePublicoComponent implements OnInit {

  frota: FrotaCliente | null = null;
  carregando = true;
  naoEncontrado = false;
  erro = false;

  constructor(private route: ActivatedRoute, private servico: EtiquetaService) { }

  ngOnInit(): void {
    const codigo = this.route.snapshot.paramMap.get('codigo') || '';
    this.servico.consultarFrotaPorLinkCliente(codigo).subscribe({
      next: (f) => {
        this.frota = f;
        this.carregando = false;
      },
      error: (e) => {
        this.carregando = false;
        if (e?.status === 404) this.naoEncontrado = true;
        else this.erro = true;
      }
    });
  }
}
