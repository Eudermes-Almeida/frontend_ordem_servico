import { Component } from '@angular/core';
import { CabecalhoComponent } from "../../HOME/cabecalho/cabecalho.component";
import { MenuLateralComponent } from "../../HOME/menu-lateral/menu-lateral.component";
import { FORMCONSULTAOSComponent } from "../../CONSULTA_OS/form-consulta-os/form-consulta-os.component";
import { RodapeComponent } from "../../HOME/rodape/rodape.component";
import { FORMPARAMETROSComponent } from "../form-parametros/form-parametros.component";

@Component({
  selector: 'app-pag-parametros',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, FORMCONSULTAOSComponent, RodapeComponent, FORMPARAMETROSComponent],
  templateUrl: './pag-parametros.component.html',
  styleUrl: './pag-parametros.component.css'
})
export class PAGPARAMETROSComponent {

}
