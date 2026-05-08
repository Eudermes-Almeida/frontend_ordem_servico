import { Component, ElementRef, ViewChild } from '@angular/core';
import { OrdemservicoService } from '../../../../servico/ordemservico.service';
import { SomatorioOs } from '../../../../modelo/SomatorioOs';
import { DatasAnaliseFaturamento } from '../../../../modelo/DatasAnaliseFaturamento';
import { CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { CommonModule } from '@angular/common';
import { DespesaService } from '../../../../servico/despesa.service';
import { Despesa } from '../../../../modelo/Despesa';

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
  }

  constructor(
    private servico: OrdemservicoService,
    private despesaService: DespesaService

  ) { }

  meses: string[] = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro", "total", "média mensal", "média OS"];
  mesesGrafico: string[] = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  mediaFaturamento: number[] = [55956, 57859, 53694, 61685, 43253, 51747, 59802, 53909, 48544, 74920, 66593, 59003, 686208, 57184, 360];
  meta: number[] = []
  ano2021: number[] = [45263, 47496, 55264, 34300, 38566, 54531, 55912, 28343, 44365, 98289, 50336, 111978, 664643, 55386, 375];
  ano2022: number[] = [41324, 83226, 75028, 57903, 45902, 47551, 54111, 103016, 72256, 55444, 62061, 67765, 765587, 63798, 389];
  ano2023: number[] = [55682, 59216, 61577, 51530, 52849, 82528, 72223, 45191, 35707, 74695, 105647, 32396, 729241, 60770, 369];
  ano2024: number[] = [60110, 43848, 42610, 76326, 26357, 44528, 70983, 45800, 46551, 86961, 42645, 48975, 635694, 52974, 333];
  ano2026: number[] = [];
  ano2025: number[] = [];
  ano2027: number[] = [];
  ano2028: number[] = [];

  metaGrafico: number[] = [];
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
  anoSelecionado: string = "";
  datasIniciaisEfinais?: DatasAnaliseFaturamento[];
  dadosConsultaFiltro: Despesa[] = [];

  datas2022: DatasAnaliseFaturamento[] = [
    { dataInicial: "01012022", dataFinal: "31012022" }, // Janeiro
    { dataInicial: "01022022", dataFinal: "28022022" }, // Fevereiro
    { dataInicial: "01032022", dataFinal: "31032022" }, // Março
    { dataInicial: "01042022", dataFinal: "30042022" }, // Abril
    { dataInicial: "01052022", dataFinal: "31052022" }, // Maio
    { dataInicial: "01062022", dataFinal: "30062022" }, // Junho
    { dataInicial: "01072022", dataFinal: "31072022" }, // Julho
    { dataInicial: "01082022", dataFinal: "31082022" }, // Agosto
    { dataInicial: "01092022", dataFinal: "30092022" }, // Setembro
    { dataInicial: "01102022", dataFinal: "31102022" }, // Outubro
    { dataInicial: "01112022", dataFinal: "30112022" }, // Novembro
    { dataInicial: "01122022", dataFinal: "31122022" }  // Dezembro
  ];

  datas2023: DatasAnaliseFaturamento[] = [
    { dataInicial: "01012023", dataFinal: "31012023" }, // Janeiro
    { dataInicial: "01022023", dataFinal: "28022023" }, // Fevereiro
    { dataInicial: "01032023", dataFinal: "31032023" }, // Março
    { dataInicial: "01042023", dataFinal: "30042023" }, // Abril
    { dataInicial: "01052023", dataFinal: "31052023" }, // Maio
    { dataInicial: "01062023", dataFinal: "30062023" }, // Junho
    { dataInicial: "01072023", dataFinal: "31072023" }, // Julho
    { dataInicial: "01082023", dataFinal: "31082023" }, // Agosto
    { dataInicial: "01092023", dataFinal: "30092023" }, // Setembro
    { dataInicial: "01102023", dataFinal: "31102023" }, // Outubro
    { dataInicial: "01112023", dataFinal: "30112023" }, // Novembro
    { dataInicial: "01122023", dataFinal: "31122023" }  // Dezembro
  ];

  datas2024: DatasAnaliseFaturamento[] = [
    { dataInicial: "01012024", dataFinal: "31012024" }, // Janeiro
    { dataInicial: "01022024", dataFinal: "29022024" }, // Fevereiro (Bissexto!)
    { dataInicial: "01032024", dataFinal: "31032024" }, // Março
    { dataInicial: "01042024", dataFinal: "30042024" }, // Abril
    { dataInicial: "01052024", dataFinal: "31052024" }, // Maio
    { dataInicial: "01062024", dataFinal: "30062024" }, // Junho
    { dataInicial: "01072024", dataFinal: "31072024" }, // Julho
    { dataInicial: "01082024", dataFinal: "31082024" }, // Agosto
    { dataInicial: "01092024", dataFinal: "30092024" }, // Setembro
    { dataInicial: "01102024", dataFinal: "31102024" }, // Outubro
    { dataInicial: "01112024", dataFinal: "30112024" }, // Novembro
    { dataInicial: "01122024", dataFinal: "31122024" }  // Dezembro
  ];

  datas2025: DatasAnaliseFaturamento[] = [
    { dataInicial: "2025-01-01", dataFinal: "2025-01-31" }, // Janeiro
    { dataInicial: "2025-02-01", dataFinal: "2025-02-28" }, // Fevereiro
    { dataInicial: "2025-03-01", dataFinal: "2025-03-31" }, // Março
    { dataInicial: "2025-04-01", dataFinal: "2025-04-30" }, // Abril
    { dataInicial: "2025-05-01", dataFinal: "2025-05-31" }, // Maio
    { dataInicial: "2025-06-01", dataFinal: "2025-06-30" }, // Junho
    { dataInicial: "2025-07-01", dataFinal: "2025-07-31" }, // Julho
    { dataInicial: "2025-08-01", dataFinal: "2025-08-31" }, // Agosto
    { dataInicial: "2025-09-01", dataFinal: "2025-09-30" }, // Setembro
    { dataInicial: "2025-10-01", dataFinal: "2025-10-31" }, // Outubro
    { dataInicial: "2025-11-01", dataFinal: "2025-11-30" }, // Novembro
    { dataInicial: "2025-12-01", dataFinal: "2025-12-31" }  // Dezembro
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

  datas2029: DatasAnaliseFaturamento[] = [
    { dataInicial: "01012029", dataFinal: "31012029" }, // Janeiro
    { dataInicial: "01022029", dataFinal: "28022029" }, // Fevereiro
    { dataInicial: "01032029", dataFinal: "31032029" }, // Março
    { dataInicial: "01042029", dataFinal: "30042029" }, // Abril
    { dataInicial: "01052029", dataFinal: "31052029" }, // Maio
    { dataInicial: "01062029", dataFinal: "30062029" }, // Junho
    { dataInicial: "01072029", dataFinal: "31072029" }, // Julho
    { dataInicial: "01082029", dataFinal: "31082029" }, // Agosto
    { dataInicial: "01092029", dataFinal: "30092029" }, // Setembro
    { dataInicial: "01102029", dataFinal: "31102029" }, // Outubro
    { dataInicial: "01112029", dataFinal: "30112029" }, // Novembro
    { dataInicial: "01122029", dataFinal: "31122029" }  // Dezembro
];

datas2030: DatasAnaliseFaturamento[] = [
    { dataInicial: "01012030", dataFinal: "31012030" }, // Janeiro
    { dataInicial: "01022030", dataFinal: "28022030" }, // Fevereiro
    { dataInicial: "01032030", dataFinal: "31032030" }, // Março
    { dataInicial: "01042030", dataFinal: "30042030" }, // Abril
    { dataInicial: "01052030", dataFinal: "31052030" }, // Maio
    { dataInicial: "01062030", dataFinal: "30062030" }, // Junho
    { dataInicial: "01072030", dataFinal: "31072030" }, // Julho
    { dataInicial: "01082030", dataFinal: "31082030" }, // Agosto
    { dataInicial: "01092030", dataFinal: "30092030" }, // Setembro
    { dataInicial: "01102030", dataFinal: "31102030" }, // Outubro
    { dataInicial: "01112030", dataFinal: "30112030" }, // Novembro
    { dataInicial: "01122030", dataFinal: "31122030" }  // Dezembro
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

  onAnoSelecionado(event: any) {
    this.anoSelecionado = event.target.value;
    console.log("Ano selecionado (via evento):", this.anoSelecionado);
    this.consultarDespesasComFiltro();
  }



  consultarDespesasComFiltro() {
  // 1. PRIMEIRO: Escolhemos qual lista de datas usar
  switch (this.anoSelecionado) {
    case "2022":
      this.datasIniciaisEfinais = this.datas2022;
      break;
    case "2023":
      this.datasIniciaisEfinais = this.datas2023;
      break;
    case "2024":
      this.datasIniciaisEfinais = this.datas2024;
      break;
    case "2025":
      this.datasIniciaisEfinais = this.datas2025;
      break;
    case "2026":
      this.datasIniciaisEfinais = this.datas2026;
      break;
    case "2027":
      this.datasIniciaisEfinais = this.datas2027;
      break;
    case "2028":
      this.datasIniciaisEfinais = this.datas2028;
      break;
    case "2029":
      this.datasIniciaisEfinais = this.datas2029;
      break;
    case "2030":
      this.datasIniciaisEfinais = this.datas2030;
      break;
    default:
      console.log("erro: ano inválido");
      return; // Para o código aqui se o ano for errado
  } // <--- AQUI fecha o switch!

  // 2. AGORA: Com a lista escolhida, fazemos a busca para cada período
  this.datasIniciaisEfinais.forEach((periodo, index) => {
    this.despesaService?.consultarDespesasFiltro(
      periodo.dataInicial,
      periodo.dataFinal,
      "EMPRESA",
      "PAGO"
    ).subscribe({
      next: (dados: Despesa[]) => {
        if (!dados || dados.length === 0) {
          // Cuidado: se você limpar aqui, o último mês vazio vai apagar os anteriores!
          console.log(`Mês ${index + 1} sem despesas.`);
        } else {
          this.dadosConsultaFiltro = dados; 
          console.log("Busca realizada:", this.dadosConsultaFiltro);
        }
      },
      error: (err) => {
        console.error("Erro ao buscar:", err);
      }
    });
  }); // <--- AQUI fecha o forEach!
} // <--- AQUI fecha o método!


}