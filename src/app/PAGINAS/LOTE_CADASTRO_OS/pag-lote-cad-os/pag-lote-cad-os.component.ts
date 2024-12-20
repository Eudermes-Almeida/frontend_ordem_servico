import { Component } from '@angular/core';
import { CabecalhoComponent } from "../../HOME/cabecalho/cabecalho.component";
import { MenuLateralComponent } from "../../HOME/menu-lateral/menu-lateral.component";
import { FORMCADASTROOSComponent } from "../../CADASTRO_OS/form-cadastro-os/form-cadastro-os.component";
import { RodapeComponent } from "../../HOME/rodape/rodape.component";
import { FORMCADOSComponent } from "../form-cad-os/form-cad-os.component";

@Component({
  selector: 'app-pag-lote-cad-os',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, FORMCADASTROOSComponent, RodapeComponent, FORMCADOSComponent],
  templateUrl: './pag-lote-cad-os.component.html',
  styleUrl: './pag-lote-cad-os.component.css'
})
export class PAGLOTECADOSComponent {

}
