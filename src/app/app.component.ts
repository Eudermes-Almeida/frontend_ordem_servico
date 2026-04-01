// caminho: c:/programacao/alura/angular/api/api/src/app/app.component.ts

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Adicionado HttpClientModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Correção aplicada
})
export class AppComponent {
  title = 'So Monitores & Nobreaks';
}
