import { Component } from '@angular/core';
import { CabecalhoComponent } from "../../HOME/cabecalho/cabecalho.component";
import { MenuLateralComponent } from "../../HOME/menu-lateral/menu-lateral.component";
import { FORMALTERAOSPAG1Component } from "../../ALTERA_OS_PAG_1/form-altera-os-pag1/form-altera-os-pag1.component";
import { RodapeComponent } from "../../HOME/rodape/rodape.component";
import { FORMALTERAOSPAG2Component } from "../form-altera-os-pag2/form-altera-os-pag2.component";
import { TIMELINEComponent } from "../../LINHA_DO_TEMPO_OS/timeline/timeline.component";

@Component({
  selector: 'app-pag-altera-os-pag2',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, FORMALTERAOSPAG1Component, RodapeComponent, FORMALTERAOSPAG2Component, TIMELINEComponent],
  templateUrl: './pag-altera-os-pag2.component.html',
  styleUrl: './pag-altera-os-pag2.component.css'
})
export class PAGALTERAOSPAG2Component {

}
