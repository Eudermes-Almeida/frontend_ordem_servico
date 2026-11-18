import { Component } from '@angular/core';
import { CabecalhoComponent } from '../../HOME/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../HOME/menu-lateral/menu-lateral.component';
import { RodapeComponent } from '../../HOME/rodape/rodape.component';
import { FormAcompanhamentoContatosComponent } from '../form-acompanhamento-contatos/form-acompanhamento-contatos.component';

@Component({
  selector: 'app-pag-acompanhamento-contatos',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, FormAcompanhamentoContatosComponent, RodapeComponent],
  template: `
    <div class="todo">
      <app-cabecalho></app-cabecalho>
      <app-menu-lateral></app-menu-lateral>
      <app-form-acompanhamento-contatos></app-form-acompanhamento-contatos>
      <app-rodape></app-rodape>
    </div>
  `,
  styleUrl: '../pag-prospeccao/pag-prospeccao.component.css'
})
export class PagAcompanhamentoContatosComponent {

}
