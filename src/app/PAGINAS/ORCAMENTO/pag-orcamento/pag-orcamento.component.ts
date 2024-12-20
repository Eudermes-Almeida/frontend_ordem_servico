import { Component } from '@angular/core';
import { CabecalhoComponent } from "../../HOME/cabecalho/cabecalho.component";
import { MenuLateralComponent } from "../../HOME/menu-lateral/menu-lateral.component";
import { FORMIMPRIMEOSLOTEComponent } from "../../IMPRIME_OS_LOTE/form-imprime-os-lote/form-imprime-os-lote.component";
import { RodapeComponent } from "../../HOME/rodape/rodape.component";
import { FORMORCAMENTOComponent } from "../form-orcamento/form-orcamento.component";

@Component({
  selector: 'app-pag-orcamento',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, FORMIMPRIMEOSLOTEComponent, RodapeComponent, FORMORCAMENTOComponent],
  templateUrl: './pag-orcamento.component.html',
  styleUrl: './pag-orcamento.component.css'
})
export class PAGORCAMENTOComponent {

}
