import { Component } from '@angular/core';
import { CabecalhoComponent } from "../../HOME/cabecalho/cabecalho.component";
import { MenuLateralComponent } from "../../HOME/menu-lateral/menu-lateral.component";
import { FORMCONSULTAOSComponent } from "../../CONSULTA_OS/form-consulta-os/form-consulta-os.component";
import { RodapeComponent } from "../../HOME/rodape/rodape.component";
import { FORMLOGINLISTAComponent } from "../form-login-lista/form-login-lista.component";

@Component({
  selector: 'app-pag-login-lista',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, FORMCONSULTAOSComponent, RodapeComponent, FORMLOGINLISTAComponent],
  templateUrl: './pag-login-lista.component.html',
  styleUrl: './pag-login-lista.component.css'
})
export class PAGLOGINLISTAComponent {

}
