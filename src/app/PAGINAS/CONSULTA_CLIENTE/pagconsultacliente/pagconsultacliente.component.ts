import { Component } from '@angular/core';
import { CabecalhoComponent } from "../../HOME/cabecalho/cabecalho.component";
import { MenuLateralComponent } from "../../HOME/menu-lateral/menu-lateral.component";
import { FormcadclienteComponent } from "../../CADASTRO_CLIENTE/formcadcliente/formcadcliente.component";
import { RodapeComponent } from "../../HOME/rodape/rodape.component";
import { FormconsultaclienteComponent } from "../formconsultacliente/formconsultacliente.component";

@Component({
  selector: 'app-pagconsultacliente',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, FormcadclienteComponent, RodapeComponent, FormconsultaclienteComponent],
  templateUrl: './pagconsultacliente.component.html',
  styleUrl: './pagconsultacliente.component.css'
})
export class PagconsultaclienteComponent {

}
