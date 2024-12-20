import { Component } from '@angular/core';
import { CabecalhoComponent } from "../../HOME/cabecalho/cabecalho.component";
import { MenuLateralComponent } from "../../HOME/menu-lateral/menu-lateral.component";
import { CarouselComponent } from "../../HOME/carousel/carousel.component";
import { RodapeComponent } from "../../HOME/rodape/rodape.component";
import { FormcadclienteComponent } from "../formcadcliente/formcadcliente.component";
import { OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
//import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagcadastrocliente',
  standalone: true,
  imports: [CabecalhoComponent, MenuLateralComponent, CarouselComponent,
     RodapeComponent, FormcadclienteComponent],
  templateUrl: './pagcadastrocliente.component.html',
  styleUrl: './pagcadastrocliente.component.css'
})
export class PagcadastroclienteComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Ativa o modo fullscreen ao acessar esta rota
        this.telacheia();
      }
    });
  }

  telacheia(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
      });
    }
  }
}
