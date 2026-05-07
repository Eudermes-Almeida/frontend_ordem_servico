import { Component } from '@angular/core';
import { CabecalhoComponent } from '../../../HOME/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../../HOME/menu-lateral/menu-lateral.component';
import { FormularioAnaliseDespesaComponent } from '../../form-analise-despesa/formulario-analise-despesa/formulario-analise-despesa.component';
import { RodapeComponent } from '../../../HOME/rodape/rodape.component';

@Component({
  selector: 'app-pagina-analise-despesa',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, FormularioAnaliseDespesaComponent, RodapeComponent],
  templateUrl: './pagina-analise-despesa.component.html',
  styleUrl: './pagina-analise-despesa.component.css'
})
export class PaginaAnaliseDespesaComponent {

}
