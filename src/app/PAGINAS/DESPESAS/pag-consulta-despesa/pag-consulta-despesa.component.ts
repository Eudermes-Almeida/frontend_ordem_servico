import { Component } from '@angular/core';
import { CabecalhoComponent } from '../../HOME/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../HOME/menu-lateral/menu-lateral.component';
import { RodapeComponent } from '../../HOME/rodape/rodape.component';
import { FormConsultaDespesaComponent } from '../form-consulta-despesa/form-consulta-despesa.component';

@Component({
  selector: 'app-pag-consulta-despesa',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, RodapeComponent, FormConsultaDespesaComponent],
  templateUrl: './pag-consulta-despesa.component.html',
  styleUrl: './pag-consulta-despesa.component.css'
})
export class PagConsultaDespesaComponent {

}
