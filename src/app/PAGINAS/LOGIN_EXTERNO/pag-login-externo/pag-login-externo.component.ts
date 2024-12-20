import { Component } from '@angular/core';
import { CabecalhoComponent } from "../../HOME/cabecalho/cabecalho.component";
import { MenuLateralComponent } from "../../HOME/menu-lateral/menu-lateral.component";
import { FORMDELETAROSComponent } from "../../DELETAR_OS/form-deletar-os/form-deletar-os.component";
import { RodapeComponent } from "../../HOME/rodape/rodape.component";
import { FORMLOGINEXTERNOComponent } from "../form-login-externo/form-login-externo.component";

@Component({
  selector: 'app-pag-login-externo',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, FORMDELETAROSComponent, RodapeComponent, FORMLOGINEXTERNOComponent],
  templateUrl: './pag-login-externo.component.html',
  styleUrl: './pag-login-externo.component.css'
})
export class PAGLOGINEXTERNOComponent {

}
