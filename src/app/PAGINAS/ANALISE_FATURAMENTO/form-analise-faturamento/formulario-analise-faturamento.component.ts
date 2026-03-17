import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-formulario-analise-faturamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formulario-analise-faturamento.component.html',
  styleUrl: './formulario-analise-faturamento.component.css'
})
export class FormularioAnaliseFaturamentoComponent {

  meses: string[] = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro", "total","média mensal", "média OS"];
  mediaFaturamento: number[] = [55.956, 57.859, 53.694, 61.685, 43.253, 51.747, 59.802, 53.909, 48.544, 74.920, 66.593, 59.003, 686.970, 57.247, 358];
  ano2021: number[] = [45.263, 47.496, 55.264, 34.300, 38.566, 54.531, 55.912, 28.343, 44.365, 98.289, 50.336, 111.978, 664.643, 55.386, 375];
  ano2022: number[] = [41.324, 83.226, 75.028, 57.903, 45.902, 47.551, 54.111, 103.016, 72.256, 55.444, 62.061, 67.765, 765.587, 63.798, 389];
  ano2023: number[] = [55.682, 59.216, 61.577, 51.530, 52.849, 82.528, 72.223, 45.191, 35.707, 74.695, 105.647, 32.396, 729.241, 60.770, 369];
  ano2024: number[] = [60.110, 43.848, 42.610, 76.326, 26.357, 44.528, 70.983, 45.800, 46.551, 86.961, 42.645, 48.975, 635.694, 52.974, 333 ];
  ano2025: number[] = [77.402, 55.511, 33.995, 88.367, 52.593, 29.600, 45.783, 47.199, 43.841, 59.211, 72.279, 33.905, 639.686, 53.307, 328];




}









