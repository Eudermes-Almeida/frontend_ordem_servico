import { Component } from '@angular/core';
import { CabecalhoComponent } from "../../HOME/cabecalho/cabecalho.component";
import { MenuLateralComponent } from "../../HOME/menu-lateral/menu-lateral.component";
import { FORMCONSULTAOSComponent } from "../../CONSULTA_OS/form-consulta-os/form-consulta-os.component";
import { RodapeComponent } from "../../HOME/rodape/rodape.component";
import { FORMDELETAROSComponent } from "../form-deletar-os/form-deletar-os.component";

@Component({
  selector: 'app-pag-deletar-os',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, FORMCONSULTAOSComponent, RodapeComponent, FORMDELETAROSComponent],
  templateUrl: './pag-deletar-os.component.html',
  styleUrl: './pag-deletar-os.component.css'
})
export class PAGDELETAROSComponent {

}
