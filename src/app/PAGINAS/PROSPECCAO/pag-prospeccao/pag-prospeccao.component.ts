import { Component } from '@angular/core';
import { CabecalhoComponent } from '../../HOME/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../HOME/menu-lateral/menu-lateral.component';
import { RodapeComponent } from '../../HOME/rodape/rodape.component';
import { FormProspeccaoComponent } from '../form-prospeccao/form-prospeccao.component';

@Component({
  selector: 'app-pag-prospeccao',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, FormProspeccaoComponent, RodapeComponent],
  templateUrl: './pag-prospeccao.component.html',
  styleUrl: './pag-prospeccao.component.css'
})
export class PagProspeccaoComponent {

}
