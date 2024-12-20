import { Component } from '@angular/core';
import { CabecalhoComponent } from "../../HOME/cabecalho/cabecalho.component";
import { MenuLateralComponent } from "../../HOME/menu-lateral/menu-lateral.component";
import { FormconsultaclienteComponent } from "../../CONSULTA_CLIENTE/formconsultacliente/formconsultacliente.component";
import { RodapeComponent } from "../../HOME/rodape/rodape.component";
import { FORMCONSULTAOSComponent } from "../form-consulta-os/form-consulta-os.component";
import { TimeLineComponent } from "../../../home/time-line/time-line.component";
import { TIMELINEComponent } from "../../LINHA_DO_TEMPO_OS/timeline/timeline.component";

@Component({
  selector: 'app-pag-consulta-os',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, FormconsultaclienteComponent, RodapeComponent, FORMCONSULTAOSComponent, TimeLineComponent, TIMELINEComponent],
  templateUrl: './pag-consulta-os.component.html',
  styleUrl: './pag-consulta-os.component.css'
})
export class PAGCONSULTAOSComponent {

}
