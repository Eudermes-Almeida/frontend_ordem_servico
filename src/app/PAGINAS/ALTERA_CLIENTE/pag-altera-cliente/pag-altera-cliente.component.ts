import { Component } from '@angular/core';
import { CabecalhoComponent } from "../../HOME/cabecalho/cabecalho.component";
import { MenuLateralComponent } from "../../HOME/menu-lateral/menu-lateral.component";
import { FormcadclienteComponent } from "../../CADASTRO_CLIENTE/formcadcliente/formcadcliente.component";
import { RodapeComponent } from "../../HOME/rodape/rodape.component";
import { FORMALTERACLIENTEComponent } from "../form-altera-cliente/form-altera-cliente.component";

@Component({
  selector: 'app-pag-altera-cliente',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, FormcadclienteComponent, RodapeComponent, FORMALTERACLIENTEComponent],
  templateUrl: './pag-altera-cliente.component.html',
  styleUrl: './pag-altera-cliente.component.css'
})
export class PAGALTERACLIENTEComponent {

}
