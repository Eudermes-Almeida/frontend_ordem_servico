import { Component } from '@angular/core';
import { CabecalhoComponent } from "../../HOME/cabecalho/cabecalho.component";
import { MenuLateralComponent } from "../../HOME/menu-lateral/menu-lateral.component";
import { FormcadclienteComponent } from "../../CADASTRO_CLIENTE/formcadcliente/formcadcliente.component";
import { RodapeComponent } from "../../HOME/rodape/rodape.component";
import { FORMCADASTROOSComponent } from "../form-cadastro-os/form-cadastro-os.component";

@Component({
  selector: 'app-pag-cadastro-os',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, FormcadclienteComponent, RodapeComponent, FORMCADASTROOSComponent],
  templateUrl: './pag-cadastro-os.component.html',
  styleUrl: './pag-cadastro-os.component.css'
})
export class PAGCADASTROOSComponent {

}
