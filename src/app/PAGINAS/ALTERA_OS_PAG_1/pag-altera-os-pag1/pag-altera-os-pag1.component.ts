import { Component } from '@angular/core';
import { CabecalhoComponent } from "../../HOME/cabecalho/cabecalho.component";
import { MenuLateralComponent } from "../../HOME/menu-lateral/menu-lateral.component";
import { FORMALTERACLIENTEComponent } from "../../ALTERA_CLIENTE/form-altera-cliente/form-altera-cliente.component";
import { RodapeComponent } from "../../HOME/rodape/rodape.component";
import { FORMALTERAOSPAG1Component } from "../form-altera-os-pag1/form-altera-os-pag1.component";
import { TIMELINEComponent } from "../../LINHA_DO_TEMPO_OS/timeline/timeline.component";

@Component({
  selector: 'app-pag-altera-os-pag1',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, FORMALTERACLIENTEComponent, RodapeComponent, FORMALTERAOSPAG1Component, TIMELINEComponent],
  templateUrl: './pag-altera-os-pag1.component.html',
  styleUrl: './pag-altera-os-pag1.component.css'
})
export class PAGALTERAOSPAG1Component {

}
