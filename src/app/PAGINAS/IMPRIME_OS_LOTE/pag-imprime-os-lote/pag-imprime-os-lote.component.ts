import { Component } from '@angular/core';
import { CabecalhoComponent } from "../../HOME/cabecalho/cabecalho.component";
import { MenuLateralComponent } from "../../HOME/menu-lateral/menu-lateral.component";
import { FORMCONSULTAOSComponent } from "../../CONSULTA_OS/form-consulta-os/form-consulta-os.component";
import { RodapeComponent } from "../../HOME/rodape/rodape.component";
import { FORMIMPRIMEOSLOTEComponent } from "../form-imprime-os-lote/form-imprime-os-lote.component";

@Component({
  selector: 'app-pag-imprime-os-lote',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, FORMCONSULTAOSComponent, RodapeComponent, FORMIMPRIMEOSLOTEComponent],
  templateUrl: './pag-imprime-os-lote.component.html',
  styleUrl: './pag-imprime-os-lote.component.css'
})
export class PAGIMPRIMEOSLOTEComponent {

}
