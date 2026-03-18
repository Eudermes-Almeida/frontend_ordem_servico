import { DatasAnaliseFaturamento } from './../../../modelo/DatasAnaliseFaturamento';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdemservicoService } from '../../../servico/ordemservico.service';
import { SomatorioOs } from '../../../modelo/SomatorioOs';


@Component({
  selector: 'app-formulario-analise-faturamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formulario-analise-faturamento.component.html',
  styleUrl: './formulario-analise-faturamento.component.css'
})
export class FormularioAnaliseFaturamentoComponent {

  constructor(
        private servico: OrdemservicoService,
  
    ) {}

  meses: string[] = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro", "total","média mensal", "média OS"];
  mediaFaturamento: number[] = [55.956, 57.859, 53.694, 61.685, 43.253, 51.747, 59.802, 53.909, 48.544, 74.920, 66.593, 59.003, 686.970, 57.247, 358];
  ano2021: number[] = [45.263, 47.496, 55.264, 34.300, 38.566, 54.531, 55.912, 28.343, 44.365, 98.289, 50.336, 111.978, 664.643, 55.386, 375];
  ano2022: number[] = [41.324, 83.226, 75.028, 57.903, 45.902, 47.551, 54.111, 103.016, 72.256, 55.444, 62.061, 67.765, 765.587, 63.798, 389];
  ano2023: number[] = [55.682, 59.216, 61.577, 51.530, 52.849, 82.528, 72.223, 45.191, 35.707, 74.695, 105.647, 32.396, 729.241, 60.770, 369];
  ano2024: number[] = [60.110, 43.848, 42.610, 76.326, 26.357, 44.528, 70.983, 45.800, 46.551, 86.961, 42.645, 48.975, 635.694, 52.974, 333 ];
  //ano2025: number[] = [77.402, 55.511, 33.995, 88.367, 52.593, 29.600, 45.783, 47.199, 43.841, 59.211, 72.279, 33.905, 639.686, 53.307, 328];
  //ano2026: number[] = [];
  ano2027: number[] = [];
  ano2028: number[] = [];

  
  somatoriaOS: SomatorioOs;
  datasAnaliseFaturamento: DatasAnaliseFaturamento = {
    dataInicial: "01012026",
     dataFinal : "31012026"}

  datas2026: DatasAnaliseFaturamento[] = [
  { dataInicial: "01012026", dataFinal: "31012026" }, // Janeiro
  { dataInicial: "01022026", dataFinal: "28022026" }, // Fevereiro
  { dataInicial: "01032026", dataFinal: "31032026" }, // Março
  { dataInicial: "01042026", dataFinal: "30042026" }, // Abril
  { dataInicial: "01052026", dataFinal: "31052026" }, // Maio
  { dataInicial: "01062026", dataFinal: "30062026" }, // Junho
  { dataInicial: "01072026", dataFinal: "31072026" }, // Julho
  { dataInicial: "01082026", dataFinal: "31082026" }, // Agosto
  { dataInicial: "01092026", dataFinal: "30092026" }, // Setembro
  { dataInicial: "01102026", dataFinal: "31102026" }, // Outubro
  { dataInicial: "01112026", dataFinal: "30112026" }, // Novembro
  { dataInicial: "01122026", dataFinal: "31122026" }  // Dezembro
];

datas2025: DatasAnaliseFaturamento[] = [
  { dataInicial: "01012025", dataFinal: "31012025" }, // Janeiro
  { dataInicial: "01022025", dataFinal: "28022025" }, // Fevereiro
  { dataInicial: "01032025", dataFinal: "31032025" }, // Março
  { dataInicial: "01042025", dataFinal: "30042025" }, // Abril
  { dataInicial: "01052025", dataFinal: "31052025" }, // Maio
  { dataInicial: "01062025", dataFinal: "30062025" }, // Junho
  { dataInicial: "01072025", dataFinal: "31072025" }, // Julho
  { dataInicial: "01082025", dataFinal: "31082025" }, // Agosto
  { dataInicial: "01092025", dataFinal: "30092025" }, // Setembro
  { dataInicial: "01102025", dataFinal: "31102025" }, // Outubro
  { dataInicial: "01112025", dataFinal: "30112025" }, // Novembro
  { dataInicial: "01122025", dataFinal: "31122025" }  // Dezembro
];





 // Array onde você vai guardar os resultados para a tabela
ano2026: number[] = [];
ano2025: number[] = [];

buscaSomatoriaFaturamentoEntreDatas2025() {
  console.log("Iniciando busca de todos os meses de 2025...");

  this.ano2025 = [];
  // Array auxiliar para armazenar as quantidades de cada mês
  const quantidadesMensais: number[] = [];

  this.datas2025.forEach((periodo, index) => {
    this.servico.buscaSomatorioFaturamento(periodo.dataInicial, periodo.dataFinal).subscribe({
      next: (data: SomatorioOs) => {
        // Armazena o valor financeiro e a quantidade nos respectivos índices
        this.ano2025[index] = data.somatotaliq;
        quantidadesMensais[index] = data.qtOs;

        const respostasRecebidas = this.ano2025.filter(v => v !== undefined).length;

        if (respostasRecebidas === 12) {
          const valoresMeses = this.ano2025.slice(0, 12);

          // 1. Total Anual (Índice 12)
          const totalAnual = valoresMeses.reduce((acc, curr) => acc + (curr || 0), 0);
          this.ano2025[12] = totalAnual;

          // 2. Média Mensal (Índice 13)
          const mesesComFaturamento = valoresMeses.filter(valor => valor > 0);
          this.ano2025[13] = mesesComFaturamento.length > 0 
            ? totalAnual / mesesComFaturamento.length 
            : 0;

          // 3. Média por Equipamento (Índice 14)
          // Soma todas as quantidades de OS do ano
          const totalEquipamentosAnual = quantidadesMensais.reduce((acc, curr) => acc + (curr || 0), 0);
          
          this.ano2025[14] = totalEquipamentosAnual > 0 
            ? totalAnual / totalEquipamentosAnual 
            : 0;

          console.log(`Total Anual: ${totalAnual} | Equipamentos: ${totalEquipamentosAnual} | Média/Eq: ${this.ano2025[14]}`);
        }
      },
      error: (error) => {
        console.error(`Erro no mês ${index + 1}:`, error);
        this.ano2025[index] = 0;
        quantidadesMensais[index] = 0;
      }
    });
  });
}




  // buscaSomatoriaFaturamentoEntreDatas() {
  
  //   const inicio = "01042025";
  //   const fim = "30042025";

  
  //   this.servico.buscaSomatorioFaturamento(inicio, fim).subscribe({
  //     next: (data: SomatorioOs) => {
  //       // Armazena o valor no índice correto para manter a ordem dos meses
  //       const somatoria = data.somatotaliq;
  //       const equipamentos = data.qtOs;
        
  //       console.log("Esta é a somatória do mes ", somatoria);
  //       console.log("Esta é a quantidade de equipamentos ", equipamentos);
  //     },
  //     error: (error) => {
  //       console.error(error);
        
  //     }
  //   });
  
}


  











