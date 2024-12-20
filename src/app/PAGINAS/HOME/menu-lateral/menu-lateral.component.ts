import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent {
  dropdownOpen: boolean = false; // Estado do dropdown

  

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen; // Alterna o estado do dropdown
  }

  closeDropdown(event: MouseEvent): void {
    // Fecha o dropdown se o clique for fora do botão
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      this.dropdownOpen = false;
    }
  }

  ngOnInit(): void {
    //this.telacheia()
  }
  

  async reiniciarPagina():Promise<void> {
    window.location.reload();

    await this.delay(1000); // Atraso de 1000 ms = 1 segundo
    ///this.telacheia();
    
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

// telacheia(){

//   // Verifica se a página já está em tela cheia
//   if (!document.fullscreenElement) {
//     // Se não estiver, solicita para entrar em tela cheia
//     document.documentElement.requestFullscreen();
//   } else {
//     // Se já estiver em tela cheia, sai do modo tela cheia
//     if (document.exitFullscreen) {
//       document.exitFullscreen();
//     }
//   }
//}




  


}
