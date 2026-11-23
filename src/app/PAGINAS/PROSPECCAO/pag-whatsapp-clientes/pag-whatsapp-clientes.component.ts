import { Component } from '@angular/core';
import { CabecalhoComponent } from '../../HOME/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../HOME/menu-lateral/menu-lateral.component';
import { RodapeComponent } from '../../HOME/rodape/rodape.component';
import { FormWhatsappClientesComponent } from '../form-whatsapp-clientes/form-whatsapp-clientes.component';

@Component({
  selector: 'app-pag-whatsapp-clientes',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, FormWhatsappClientesComponent, RodapeComponent],
  template: `
    <div class="todo">
      <app-cabecalho></app-cabecalho>
      <app-menu-lateral></app-menu-lateral>
      <app-form-whatsapp-clientes></app-form-whatsapp-clientes>
      <app-rodape></app-rodape>
    </div>
  `,
  styleUrl: '../pag-prospeccao/pag-prospeccao.component.css'
})
export class PagWhatsappClientesComponent {

}
