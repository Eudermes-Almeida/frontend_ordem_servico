import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import QRCode from 'qrcode';
import { EtiquetaService } from '../../../servico/etiqueta.service';
import { EtiquetaOs } from '../../../modelo/Etiqueta';

/**
 * Etiqueta 100 x 50 mm (impressora térmica) com QR Code do histórico do equipamento.
 * Rota: /os/etiqueta/:os  (aberta em outra aba pelo botão "Imprimir etiqueta" da OS).
 * Imprime pelo navegador: na impressora térmica ou "Salvar como PDF".
 */
@Component({
  selector: 'app-pag-etiqueta-os',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pag-etiqueta-os.component.html',
  styleUrl: './pag-etiqueta-os.component.css'
})
export class PagEtiquetaOsComponent implements OnInit, OnDestroy {

  etiqueta: EtiquetaOs | null = null;
  qrCode: string = '';
  carregando = true;
  erro = '';

  /** regras de impressão (@page) precisam ficar no <head>, fora do CSS do componente */
  private estiloImpressao: HTMLStyleElement | null = null;

  constructor(private route: ActivatedRoute, private servico: EtiquetaService) { }

  ngOnInit(): void {
    this.instalarEstiloImpressao();
    const os = Number(this.route.snapshot.paramMap.get('os'));
    if (!os) {
      this.carregando = false;
      this.erro = 'Número da ordem de serviço inválido.';
      return;
    }
    this.servico.gerarEtiqueta(os).subscribe({
      next: (dados) => {
        this.etiqueta = dados;
        QRCode.toDataURL(dados.url, { errorCorrectionLevel: 'M', margin: 2, width: 600 })
          .then((url: string) => {
            this.qrCode = url;
            this.carregando = false;
            // espera o QR desenhar antes de abrir a janela de impressão
            // (?auto=0 só mostra a etiqueta, sem abrir a impressão: usado em testes)
            if (this.route.snapshot.queryParamMap.get('auto') !== '0') {
              setTimeout(() => this.imprimir(), 400);
            }
          })
          .catch(() => {
            this.carregando = false;
            this.erro = 'Não foi possível gerar o QR Code.';
          });
      },
      error: (e) => {
        this.carregando = false;
        this.erro = typeof e?.error === 'string' && e.error
          ? e.error
          : 'Não foi possível gerar a etiqueta (backend indisponível).';
      }
    });
  }

  ngOnDestroy(): void {
    this.estiloImpressao?.remove();
  }

  imprimir(): void {
    window.print();
  }

  fechar(): void {
    window.close();
  }

  /** yyyy-MM-dd -> dd/MM/yyyy */
  dataBr(iso: string | null | undefined): string {
    if (!iso) return '';
    const [a, m, d] = iso.substring(0, 10).split('-');
    return `${d}/${m}/${a}`;
  }

  private instalarEstiloImpressao(): void {
    const css = `
      @page { size: 100mm 50mm; margin: 0; }
      @media print {
        html, body {
          margin: 0 !important; padding: 0 !important; background: #fff !important;
          width: 100mm !important; height: 50mm !important; overflow: hidden !important;
        }
        .etq-painel { display: none !important; }
        .etq-pagina { display: block !important; min-height: 0 !important; padding: 0 !important; background: #fff !important; }
        .etq-moldura { width: 100mm !important; height: 50mm !important; display: block !important; }
        .etq-imprimir { transform: none !important; box-shadow: none !important; page-break-inside: avoid; }
      }`;
    this.estiloImpressao = document.createElement('style');
    this.estiloImpressao.textContent = css;
    document.head.appendChild(this.estiloImpressao);
  }
}
