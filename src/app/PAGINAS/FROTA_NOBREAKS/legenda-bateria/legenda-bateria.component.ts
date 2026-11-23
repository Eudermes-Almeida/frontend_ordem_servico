import { Component } from '@angular/core';

/**
 * Legenda da situação do banco de baterias (mesmos limites da prospecção).
 * Usada na página pública do QR e na lista de nobreaks do cliente (QR e login externo).
 */
@Component({
  selector: 'app-legenda-bateria',
  standalone: true,
  template: `
    <div class="lg-legenda">
      <div class="lg-titulo">Legenda (tempo desde a última manutenção):</div>
      <div class="lg-item"><b class="lg-ativo">ATIVO</b><span>até 18 meses</span></div>
      <div class="lg-item"><b class="lg-atencao">TESTAR autonomia</b><span>mais de 18 meses até 24 meses</span></div>
      <div class="lg-item"><b class="lg-vencido">Encaminhar p/ ANÁLISE TÉCNICA gratuita</b><span>mais de 24 meses</span></div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .lg-legenda {
      margin: 12px 0;
      padding: 10px 12px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.04);
      color: #e8e8e8;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 14px;
      text-align: left;
    }
    .lg-titulo { color: #a3a9b3; font-size: 13px; margin-bottom: 6px; }
    /* coluna do rótulo larga o bastante p/ "Encaminhar p/ análise técnica" (quebra em 2 linhas no celular) */
    .lg-item { display: grid; grid-template-columns: 44% 1fr; gap: 8px; padding: 3px 0; align-items: start; }
    .lg-ativo   { color: #3ddc84; }
    .lg-atencao { color: #ffc107; }
    .lg-vencido { color: #ff6b6b; }
  `]
})
export class LegendaBateriaComponent { }
