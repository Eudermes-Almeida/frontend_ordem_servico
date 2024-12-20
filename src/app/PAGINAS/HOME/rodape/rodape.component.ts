import { Component } from '@angular/core';

@Component({
  selector: 'app-rodape',
  standalone: true,
  imports: [],
  templateUrl: './rodape.component.html',
  styleUrl: './rodape.component.css'
})
export class RodapeComponent {

  telacheia(){

    // Verifica se a página já está em tela cheia
    if (!document.fullscreenElement) {
      // Se não estiver, solicita para entrar em tela cheia
      document.documentElement.requestFullscreen();
    } else {
      // Se já estiver em tela cheia, sai do modo tela cheia
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

    
  


}
