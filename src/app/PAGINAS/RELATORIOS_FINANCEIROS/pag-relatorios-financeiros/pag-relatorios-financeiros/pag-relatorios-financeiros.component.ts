import { Component } from '@angular/core';
import { CabecalhoComponent } from '../../../HOME/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../../HOME/menu-lateral/menu-lateral.component';
import { RodapeComponent } from '../../../HOME/rodape/rodape.component';
import { FormRelatoriosFinanceirosComponent } from "../../form-relatorios-financeiros/form-relatorios-financeiros/form-relatorios-financeiros.component";


@Component({
  selector: 'app-pag-relatorios-financeiros',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, RodapeComponent, FormRelatoriosFinanceirosComponent],
  templateUrl: './pag-relatorios-financeiros.component.html',
  styleUrl: './pag-relatorios-financeiros.component.css'
})
export class PagRelatoriosFinanceirosComponent {

}
