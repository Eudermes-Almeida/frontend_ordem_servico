import { Component, ElementRef, ViewChild } from '@angular/core';
import { OrdemservicoService } from '../../../../servico/ordemservico.service';
import { SomatorioOs } from '../../../../modelo/SomatorioOs';
import { DatasAnaliseFaturamento } from '../../../../modelo/DatasAnaliseFaturamento';
import { CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulario-analise-despesa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formulario-analise-despesa.component.html',
  styleUrl: './formulario-analise-despesa.component.css'
})
export class FormularioAnaliseDespesaComponent {
 @ViewChild('grafico1') elemento!: ElementRef<HTMLCanvasElement>;

  ngOnInit(): void {
    this.buscaSomatoriaFaturamentoEntreDatas2025();
    this.calculandoMeta();
  }


  constructor(
    private servico: OrdemservicoService,

  ) { }

  meses: string[] = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro", "total", "média mensal", "média OS"];
  mesesGrafico: string[] = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  mediaFaturamento: number[] = [55956, 57859, 53694, 61685, 43253, 51747, 59802, 53909, 48544, 74920, 66593, 59003, 686208, 57184, 360 ];
  meta: number[] = []
  ano2021: number[] = [45263, 47496, 55264, 34300, 38566, 54531, 55912, 28343, 44365, 98289, 50336, 111978, 664643, 55386, 375];
  ano2022: number[] = [41324, 83226, 75028, 57903, 45902, 47551, 54111, 103016, 72256, 55444, 62061, 67765, 765587, 63798, 389];
  ano2023: number[] = [55682, 59216, 61577, 51530, 52849, 82528, 72223, 45191, 35707, 74695, 105647, 32396, 729241, 60770, 369];
  ano2024: number[] = [60110, 43848, 42610, 76326, 26357, 44528, 70983, 45800, 46551, 86961, 42645, 48975, 635694, 52974, 333];
  ano2026: number[] = [];
  ano2025: number[] = [];
  ano2027: number[] = [];
  ano2028: number[] = [];

  metaGrafico: number [] = [];
  ano2021Grafico: number[] = [];
  ano2022Grafico: number[] = [];
  ano2023Grafico: number[] = [];
  ano2024Grafico: number[] = [];
  ano2026Grafico: number[] = [];
  ano2025Grafico: number[] = [];
  ano2027Grafico: number[] = [];
  ano2028Grafico: number[] = [];


  somatoriaOS: SomatorioOs;
  fatorMeta: number = 1
  modoAnalitico: boolean = true

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


  datas2027: DatasAnaliseFaturamento[] = [
    { dataInicial: "01012027", dataFinal: "31012027" }, // Janeiro
    { dataInicial: "01022027", dataFinal: "28022027" }, // Fevereiro
    { dataInicial: "01032027", dataFinal: "31032027" }, // Março
    { dataInicial: "01042027", dataFinal: "30042027" }, // Abril
    { dataInicial: "01052027", dataFinal: "31052027" }, // Maio
    { dataInicial: "01062027", dataFinal: "30062027" }, // Junho
    { dataInicial: "01072027", dataFinal: "31072027" }, // Julho
    { dataInicial: "01082027", dataFinal: "31082027" }, // Agosto
    { dataInicial: "01092027", dataFinal: "30092027" }, // Setembro
    { dataInicial: "01102027", dataFinal: "31102027" }, // Outubro
    { dataInicial: "01112027", dataFinal: "30112027" }, // Novembro
    { dataInicial: "01122027", dataFinal: "31122027" }  // Dezembro
  ];

  datas2028: DatasAnaliseFaturamento[] = [
    { dataInicial: "01012028", dataFinal: "31012028" }, // Janeiro
    { dataInicial: "01022028", dataFinal: "29022028" }, // Fevereiro (Ano Bissexto)
    { dataInicial: "01032028", dataFinal: "31032028" }, // Março
    { dataInicial: "01042028", dataFinal: "30042028" }, // Abril
    { dataInicial: "01052028", dataFinal: "31052028" }, // Maio
    { dataInicial: "01062028", dataFinal: "30062028" }, // Junho
    { dataInicial: "01072028", dataFinal: "31072028" }, // Julho
    { dataInicial: "01082028", dataFinal: "31082028" }, // Agosto
    { dataInicial: "01092028", dataFinal: "30092028" }, // Setembro
    { dataInicial: "01102028", dataFinal: "31102028" }, // Outubro
    { dataInicial: "01112028", dataFinal: "30112028" }, // Novembro
    { dataInicial: "01122028", dataFinal: "31122028" }  // Dezembro
  ];

  criandoArraysGraficos() {
  this.ano2021Grafico = this.ano2021.slice(0, 12);
  this.ano2022Grafico = this.ano2022.slice(0, 12);
  this.ano2023Grafico = this.ano2023.slice(0, 12);
  this.ano2024Grafico = this.ano2024.slice(0, 12);
  this.ano2025Grafico = this.ano2025.slice(0, 12);
  this.ano2026Grafico = this.ano2026.slice(0, 12);
  this.ano2027Grafico = this.ano2027.slice(0, 12);
  this.ano2028Grafico = this.ano2028.slice(0, 12);
  this.metaGrafico = this.meta.slice(0, 12);
  console.log(" esta criando array graficos")
}


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
            console.log(" Este é o valor de ano205 no final do metodo ", this.ano2025)
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
    this.buscaSomatoriaFaturamentoEntreDatas2026();
    this.buscaSomatoriaFaturamentoEntreDatas2027();
    this.buscaSomatoriaFaturamentoEntreDatas2028();
  }

  buscaSomatoriaFaturamentoEntreDatas2026() {
    console.log("Iniciando busca de todos os meses de 2026...");

    this.ano2026 = [];
    // Array auxiliar para armazenar as quantidades de cada mês
    const quantidadesMensais: number[] = [];

    this.datas2026.forEach((periodo, index) => {
      this.servico.buscaSomatorioFaturamento(periodo.dataInicial, periodo.dataFinal).subscribe({
        next: (data: SomatorioOs) => {
          // Armazena o valor financeiro e a quantidade nos respectivos índices
          this.ano2026[index] = data.somatotaliq;
          quantidadesMensais[index] = data.qtOs;

          const respostasRecebidas = this.ano2026.filter(v => v !== undefined).length;

          if (respostasRecebidas === 12) {
            const valoresMeses = this.ano2026.slice(0, 12);

            // 1. Total Anual (Índice 12)
            const totalAnual = valoresMeses.reduce((acc, curr) => acc + (curr || 0), 0);
            this.ano2026[12] = totalAnual;

            // 2. Média Mensal (Índice 13)
            const mesesComFaturamento = valoresMeses.filter(valor => valor > 0);
            this.ano2026[13] = mesesComFaturamento.length > 0
              ? totalAnual / mesesComFaturamento.length
              : 0;

            // 3. Média por Equipamento (Índice 14)
            // Soma todas as quantidades de OS do ano
            const totalEquipamentosAnual = quantidadesMensais.reduce((acc, curr) => acc + (curr || 0), 0);

            this.ano2026[14] = totalEquipamentosAnual > 0
              ? totalAnual / totalEquipamentosAnual
              : 0;

            console.log(`Total Anual: ${totalAnual} | Equipamentos: ${totalEquipamentosAnual} | Média/Eq: ${this.ano2026[14]}`);
          }
        },
        error: (error) => {
          console.error(`Erro no mês ${index + 1}:`, error);
          this.ano2026[index] = 0;
          quantidadesMensais[index] = 0;
        }
      });
    });
  }

  buscaSomatoriaFaturamentoEntreDatas2027() {
    console.log("Iniciando busca de todos os meses de 2027...");

    this.ano2027 = [];
    // Array auxiliar para armazenar as quantidades de cada mês
    const quantidadesMensais: number[] = [];

    this.datas2027.forEach((periodo, index) => {
      this.servico.buscaSomatorioFaturamento(periodo.dataInicial, periodo.dataFinal).subscribe({
        next: (data: SomatorioOs) => {
          // Armazena o valor financeiro e a quantidade nos respectivos índices
          this.ano2027[index] = data.somatotaliq;
          quantidadesMensais[index] = data.qtOs;

          const respostasRecebidas = this.ano2027.filter(v => v !== undefined).length;

          if (respostasRecebidas === 12) {
            const valoresMeses = this.ano2027.slice(0, 12);

            // 1. Total Anual (Índice 12)
            const totalAnual = valoresMeses.reduce((acc, curr) => acc + (curr || 0), 0);
            this.ano2027[12] = totalAnual;

            // 2. Média Mensal (Índice 13)
            const mesesComFaturamento = valoresMeses.filter(valor => valor > 0);
            this.ano2027[13] = mesesComFaturamento.length > 0
              ? totalAnual / mesesComFaturamento.length
              : 0;

            // 3. Média por Equipamento (Índice 14)
            // Soma todas as quantidades de OS do ano
            const totalEquipamentosAnual = quantidadesMensais.reduce((acc, curr) => acc + (curr || 0), 0);

            this.ano2027[14] = totalEquipamentosAnual > 0
              ? totalAnual / totalEquipamentosAnual
              : 0;

            console.log(`Total Anual: ${totalAnual} | Equipamentos: ${totalEquipamentosAnual} | Média/Eq: ${this.ano2027[14]}`);
          }
        },
        error: (error) => {
          console.error(`Erro no mês ${index + 1}:`, error);
          this.ano2027[index] = 0;
          quantidadesMensais[index] = 0;
        }
      });
    });
  }

  buscaSomatoriaFaturamentoEntreDatas2028() {
    console.log("Iniciando busca de todos os meses de 2028...");

    this.ano2028 = [];
    // Array auxiliar para armazenar as quantidades de cada mês
    const quantidadesMensais: number[] = [];

    this.datas2028.forEach((periodo, index) => {
      this.servico.buscaSomatorioFaturamento(periodo.dataInicial, periodo.dataFinal).subscribe({
        next: (data: SomatorioOs) => {
          // Armazena o valor financeiro e a quantidade nos respectivos índices
          this.ano2028[index] = data.somatotaliq;
          quantidadesMensais[index] = data.qtOs;

          const respostasRecebidas = this.ano2028.filter(v => v !== undefined).length;

          if (respostasRecebidas === 12) {
            const valoresMeses = this.ano2028.slice(0, 12);

            // 1. Total Anual (Índice 12)
            const totalAnual = valoresMeses.reduce((acc, curr) => acc + (curr || 0), 0);
            this.ano2028[12] = totalAnual;

            // 2. Média Mensal (Índice 13)
            const mesesComFaturamento = valoresMeses.filter(valor => valor > 0);
            this.ano2028[13] = mesesComFaturamento.length > 0
              ? totalAnual / mesesComFaturamento.length
              : 0;

            // 3. Média por Equipamento (Índice 14)
            // Soma todas as quantidades de OS do ano
            const totalEquipamentosAnual = quantidadesMensais.reduce((acc, curr) => acc + (curr || 0), 0);

            this.ano2028[14] = totalEquipamentosAnual > 0
              ? totalAnual / totalEquipamentosAnual
              : 0;

            console.log(`Total Anual: ${totalAnual} | Equipamentos: ${totalEquipamentosAnual} | Média/Eq: ${this.ano2028[14]}`);
          }
        },
        error: (error) => {
          console.error(`Erro no mês ${index + 1}:`, error);
          this.ano2028[index] = 0;
          quantidadesMensais[index] = 0;
        }
      });
    });
  }

  // Esta função transforma o número em texto formatado para a tela
  formatarParaTela(valor: any): string {
    if (valor === undefined || valor === null || isNaN(valor)) return '-';

    // Usamos 'de-DE' para forçar o ponto como separador de milhar
    // minimumFractionDigits: 0 remove as casas decimais
    return Number(valor).toLocaleString('de-DE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  calculandoMeta() {
    this.meta = this.mediaFaturamento.map(valor => valor * this.fatorMeta)

  }

  aumentarFator() {
    this.fatorMeta = this.fatorMeta + 0.01
    this.calculandoMeta();
    if(!this.modoAnalitico){
      this.criandoArraysGraficos();
      this.funcModoGrafico();}
  }

  diminuirFator() {
    this.fatorMeta = this.fatorMeta - 0.01
    this.calculandoMeta();

    if(!this.modoAnalitico){
      this.criandoArraysGraficos();
      this.funcModoGrafico();}
    
  }


  ////////////////////////////////////////////////////////////////////////
  //////////////////////GRÁFICOS////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  graficoInstance1: Chart | null = null;



grafico() {

  console.log(" array 2025 dentro do grafico ", this.ano2025);
  this.criandoArraysGraficos();
  console.log(" array 2025 dentro do grafico******************************************************************* ", this.ano2025Grafico);

  Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

  if (this.graficoInstance1) {
    this.graficoInstance1.destroy();
  }

  const canvas = this.elemento.nativeElement as HTMLCanvasElement;
  
  this.graficoInstance1 = new Chart(canvas, {
    type: 'line',
    data: {
      labels: this.mesesGrafico,
      datasets: [

        {
          label: 'Meta',
          data: this.metaGrafico, // SEGUNDO ARRAY AQUI
          borderColor: '#ffffff', 
          backgroundColor: '#ffffff',
          fill: false,
          tension: 0.1,
          pointRadius: 8,
          pointHoverRadius: 12,
          pointBackgroundColor: '#ffffff',
          pointBorderWidth: 2
        },
         {
          label: '2021',
          data: this.ano2021Grafico,
          borderColor: '#f39810',
          backgroundColor: '#df850f',
          fill: false,
          tension: 0.1,
          pointRadius: 8,
          pointHoverRadius: 12,
          pointBackgroundColor: '#f39810',
          pointBorderWidth: 2
        },
        {
          label: '2022',
          data: this.ano2022Grafico,
          borderColor: '#e010f3', 
          backgroundColor: '#e010f3',
          fill: false,
          tension: 0.1,
          pointRadius: 8,
          pointHoverRadius: 12,
          pointBackgroundColor: '#e010f3',
          pointBorderWidth: 2
        },
         {
          label: '2023',
          data: this.ano2023Grafico,
          borderColor: '#0df8f8', 
          backgroundColor: '#0df8f8',
          fill: false,
          tension: 0.1,
          pointRadius: 8,
          pointHoverRadius: 12,
          pointBackgroundColor: '#0df8f8',
          pointBorderWidth: 2
        },
        {
          label: '2024',
          data: this.ano2024Grafico,
          borderColor: '#eff30c', 
          backgroundColor: '#eff30c',
          fill: false,
          tension: 0.1,
          pointRadius: 8,
          pointHoverRadius: 12,
          pointBackgroundColor: '#eff30c',
          pointBorderWidth: 2
        },
         {
          label: '2025',
          data: this.ano2025Grafico,
          borderColor: '#f30c0c', 
          backgroundColor: '#f30c0c',
          fill: false,
          tension: 0.1,
          pointRadius: 8,
          pointHoverRadius: 12,
          pointBackgroundColor: '#f30c0c',
          pointBorderWidth: 2
        },
        {
          label: '2026',
          data: this.ano2026Grafico,
          borderColor: '#0cf332',
          backgroundColor: '#0cf332',
          fill: false,
          tension: 0.1,
          pointRadius: 8,
          pointHoverRadius: 12,
          pointBackgroundColor: '#0cf332',
          pointBorderWidth: 2
        },
        {
          label: '2027',
          data: this.ano2027Grafico,
          borderColor: '#360cf3', 
          backgroundColor: '#360cf3',
          fill: false,
          tension: 0.1,
          pointRadius: 8,
          pointHoverRadius: 12,
          pointBackgroundColor: '#360cf3',
          pointBorderWidth: 2
        },
        {
          label: '2028',
          data: this.ano2027Grafico,
          borderColor: '#f34d0c', 
          backgroundColor: '#f34d0c',
          fill: false,
          tension: 0.1,
          pointRadius: 8,
          pointHoverRadius: 12,
          pointBackgroundColor: '#f34d0c',
          pointBorderWidth: 2
        },
        
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          titleColor: '#fff',
          titleFont: { size: 20, weight: 'bold' },
          // Removi a cor fixa do bodyColor para ele herdar a cor do dataset
          bodyFont: { size: 20 },
          padding: 15,
          cornerRadius: 8,
          displayColors: true, // Ativei para você ver qual cor pertence a qual dado no tooltip
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) { label += ': '; }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
              }
              return label;
            }
          }
        },
        title: {
          display: true,
          text: "Análise de Faturamento vs Meta",
          color: '#f1f5f8',
          font: { size: 25 }
        },
        legend: {
          display: true, // Garante que a legenda apareça para diferenciar as linhas
          labels: {
            color: '#f1f5f8',
            font: { size: 20 }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#f1f5f8', font: { size: 20 } }
        },
        y: {
          grid: { display: true, color: 'rgba(241, 245, 248, 0.2)', lineWidth: 1 },
          ticks: { color: '#f1f5f8', font: { size: 20 } }
        }
      }
    }
  });
}


ngAfterViewInit() {
    // Um pequeno delay garante que o DOM está 100% pronto
    setTimeout(() => {
      console.log(" este é o array 2025 " , this.ano2025)
      console.log(" este é o array 2025Grafico " , this.ano2025Grafico)
      this. criandoArraysGraficos();
      this.grafico();
    }, 1000);
  }

  funcModoAnalitico(){
this.modoAnalitico = true;
  }

  funcModoGrafico() {
  this.modoAnalitico = false;
  
  // O setTimeout de 0 ou 50ms é o segredo para o *ngIf terminar de renderizar
  setTimeout(() => {
    this.grafico(); // Chama a função que cria o Chart.js
  }, 50);
}
}
