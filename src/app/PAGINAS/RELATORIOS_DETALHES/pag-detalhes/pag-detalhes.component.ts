import { Component } from '@angular/core';
import { CabecalhoComponent } from "../../HOME/cabecalho/cabecalho.component";
import { MenuLateralComponent } from "../../HOME/menu-lateral/menu-lateral.component";
import { FORMRELATORIOSComponent } from "../../RELATORIOS/form-relatorios/form-relatorios.component";
import { RodapeComponent } from "../../HOME/rodape/rodape.component";
import { FORMDETALHESComponent } from "../form-detalhes/form-detalhes.component";

@Component({
  selector: 'app-pag-detalhes',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, FORMRELATORIOSComponent, RodapeComponent, FORMDETALHESComponent],
  templateUrl: './pag-detalhes.component.html',
  styleUrl: './pag-detalhes.component.css'
})
export class PAGDETALHESComponent {

}
