import { Component } from '@angular/core';
import { CabecalhoComponent } from "../cabecalho/cabecalho.component";
import { NavComponent } from "../nav/nav.component";
import { MenuLateralComponent } from "../menu-lateral/menu-lateral.component";
import { RodapeComponent } from "../rodape/rodape.component";
import { CarouselComponent } from "../carousel/carousel.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CabecalhoComponent, NavComponent, MenuLateralComponent, RodapeComponent, CarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


  ngOnInit(): void {
    this.ativarFullscreen(); 
    this.telacheia();  

}

ativarFullscreen(): void {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if ((elem as any).webkitRequestFullscreen) { /* Safari */
    (elem as any).webkitRequestFullscreen();
  } else if ((elem as any).msRequestFullscreen) { /* IE11 */
    (elem as any).msRequestFullscreen();
  }
}



telacheia(): void {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error('Erro ao tentar ativar o fullscreen:', err);
    });
  }
}



}