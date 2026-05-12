import { Component } from '@angular/core';
import { CabecalhoComponent } from '../../../HOME/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../../HOME/menu-lateral/menu-lateral.component';
import { RodapeComponent } from '../../../HOME/rodape/rodape.component';
import { FormFinanceiroComponent } from "../../form-financeiro/form-financeiro/form-financeiro.component";

@Component({
  selector: 'app-pag-financeiro',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, RodapeComponent, FormFinanceiroComponent],
  templateUrl: './pag-financeiro.component.html',
  styleUrl: './pag-financeiro.component.css'
})
export class PagFinanceiroComponent {

}
