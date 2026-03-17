import { Component } from '@angular/core';
import { CabecalhoComponent } from "../../HOME/cabecalho/cabecalho.component";
import { MenuLateralComponent } from "../../HOME/menu-lateral/menu-lateral.component";
import { FormcadclienteComponent } from "../../CADASTRO_CLIENTE/formcadcliente/formcadcliente.component";
import { RodapeComponent } from "../../HOME/rodape/rodape.component";
import { FORMALTERACLIENTEComponent } from '../../ALTERA_CLIENTE/form-altera-cliente/form-altera-cliente.component';
import { FormularioAnaliseFaturamentoComponent } from '../form-analise-faturamento/formulario-analise-faturamento.component';

@Component({
  selector: 'app-pagina-analise-faturamento',
  standalone: true,
   imports: [CabecalhoComponent, MenuLateralComponent, FormcadclienteComponent, RodapeComponent, FORMALTERACLIENTEComponent, FormularioAnaliseFaturamentoComponent],
  templateUrl: './pagina-analise-faturamento.component.html',
  styleUrl: './pagina-analise-faturamento.component.css'
})
export class PaginaAnaliseFaturamentoComponent {

}
