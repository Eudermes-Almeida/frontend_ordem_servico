import { Component } from '@angular/core';
import { FormDespesasComponent } from "../form-despesas/form-despesas.component";
import { CabecalhoComponent } from '../../HOME/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../HOME/menu-lateral/menu-lateral.component';
import { RodapeComponent } from '../../HOME/rodape/rodape.component';
@Component({
  selector: 'app-pag-despesas',
  standalone: true,
  imports: [FormDespesasComponent, CabecalhoComponent, MenuLateralComponent, RodapeComponent],
  templateUrl: './pag-despesas.component.html',
  styleUrl: './pag-despesas.component.css'
})
export class PagDespesasComponent {

}
