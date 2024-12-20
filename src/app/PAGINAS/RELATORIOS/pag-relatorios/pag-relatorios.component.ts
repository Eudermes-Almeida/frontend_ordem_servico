import { Component } from '@angular/core';
import { CabecalhoComponent } from "../../HOME/cabecalho/cabecalho.component";
import { MenuLateralComponent } from "../../HOME/menu-lateral/menu-lateral.component";
import { FORMORCAMENTOComponent } from "../../ORCAMENTO/form-orcamento/form-orcamento.component";
import { RodapeComponent } from "../../HOME/rodape/rodape.component";
import { FORMRELATORIOSComponent } from "../form-relatorios/form-relatorios.component";

@Component({
  selector: 'app-pag-relatorios',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, FORMORCAMENTOComponent, RodapeComponent, FORMRELATORIOSComponent],
  templateUrl: './pag-relatorios.component.html',
  styleUrl: './pag-relatorios.component.css'
})
export class PAGRELATORIOSComponent {

}
