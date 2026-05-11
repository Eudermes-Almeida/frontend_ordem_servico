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
    //this.buscaSomatoriaFaturamentoEntreDatas2025();
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
  faturamentosAnoSelecionado: number[] = [];
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
  totaisMensaisDespesas: number[] = new Array(15).fill(0);
  totalOrdensServicosAnual: number = 0;
  saldoBruto: number[] = [];
  arraydespesasCasaEigreja: number[] = [];


  datas2022: DatasAnaliseFaturamento[] = [
    { dataInicial: "2022-01-01", dataFinal: "2022-01-31" }, // Janeiro
    { dataInicial: "2022-02-01", dataFinal: "2022-02-28" }, // Fevereiro
    { dataInicial: "2022-03-01", dataFinal: "2022-03-31" }, // Março
    { dataInicial: "2022-04-01", dataFinal: "2022-04-30" }, // Abril
    { dataInicial: "2022-05-01", dataFinal: "2022-05-31" }, // Maio
    { dataInicial: "2022-06-01", dataFinal: "2022-06-30" }, // Junho
    { dataInicial: "2022-07-01", dataFinal: "2022-07-31" }, // Julho
    { dataInicial: "2022-08-01", dataFinal: "2022-08-31" }, // Agosto
    { dataInicial: "2022-09-01", dataFinal: "2022-09-30" }, // Setembro
    { dataInicial: "2022-10-01", dataFinal: "2022-10-31" }, // Outubro
    { dataInicial: "2022-11-01", dataFinal: "2022-11-30" }, // Novembro
    { dataInicial: "2022-12-01", dataFinal: "2022-12-31" }  // Dezembro
  ];


  datas2023: DatasAnaliseFaturamento[] = [
    { dataInicial: "2023-01-01", dataFinal: "2023-01-31" }, // Janeiro
    { dataInicial: "2023-02-01", dataFinal: "2023-02-28" }, // Fevereiro
    { dataInicial: "2023-03-01", dataFinal: "2023-03-31" }, // Março
    { dataInicial: "2023-04-01", dataFinal: "2023-04-30" }, // Abril
    { dataInicial: "2023-05-01", dataFinal: "2023-05-31" }, // Maio
    { dataInicial: "2023-06-01", dataFinal: "2023-06-30" }, // Junho
    { dataInicial: "2023-07-01", dataFinal: "2023-07-31" }, // Julho
    { dataInicial: "2023-08-01", dataFinal: "2023-08-31" }, // Agosto
    { dataInicial: "2023-09-01", dataFinal: "2023-09-30" }, // Setembro
    { dataInicial: "2023-10-01", dataFinal: "2023-10-31" }, // Outubro
    { dataInicial: "2023-11-01", dataFinal: "2023-11-30" }, // Novembro
    { dataInicial: "2023-12-01", dataFinal: "2023-12-31" }  // Dezembro
  ];


  datas2024: DatasAnaliseFaturamento[] = [
    { dataInicial: "2024-01-01", dataFinal: "2024-01-31" }, // Janeiro
    { dataInicial: "2024-02-01", dataFinal: "2024-02-29" }, // Fevereiro (Bissexto!)
    { dataInicial: "2024-03-01", dataFinal: "2024-03-31" }, // Março
    { dataInicial: "2024-04-01", dataFinal: "2024-04-30" }, // Abril
    { dataInicial: "2024-05-01", dataFinal: "2024-05-31" }, // Maio
    { dataInicial: "2024-06-01", dataFinal: "2024-06-30" }, // Junho
    { dataInicial: "2024-07-01", dataFinal: "2024-07-31" }, // Julho
    { dataInicial: "2024-08-01", dataFinal: "2024-08-31" }, // Agosto
    { dataInicial: "2024-09-01", dataFinal: "2024-09-30" }, // Setembro
    { dataInicial: "2024-10-01", dataFinal: "2024-10-31" }, // Outubro
    { dataInicial: "2024-11-01", dataFinal: "2024-11-30" }, // Novembro
    { dataInicial: "2024-12-01", dataFinal: "2024-12-31" }  // Dezembro
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
    { dataInicial: "2026-01-01", dataFinal: "2026-01-31" }, // Janeiro
    { dataInicial: "2026-02-01", dataFinal: "2026-02-28" }, // Fevereiro
    { dataInicial: "2026-03-01", dataFinal: "2026-03-31" }, // Março
    { dataInicial: "2026-04-01", dataFinal: "2026-04-30" }, // Abril
    { dataInicial: "2026-05-01", dataFinal: "2026-05-31" }, // Maio
    { dataInicial: "2026-06-01", dataFinal: "2026-06-30" }, // Junho
    { dataInicial: "2026-07-01", dataFinal: "2026-07-31" }, // Julho
    { dataInicial: "2026-08-01", dataFinal: "2026-08-31" }, // Agosto
    { dataInicial: "2026-09-01", dataFinal: "2026-09-30" }, // Setembro
    { dataInicial: "2026-10-01", dataFinal: "2026-10-31" }, // Outubro
    { dataInicial: "2026-11-01", dataFinal: "2026-11-30" }, // Novembro
    { dataInicial: "2026-12-01", dataFinal: "2026-12-31" }  // Dezembro
  ];

  datas2027: DatasAnaliseFaturamento[] = [
    { dataInicial: "2027-01-01", dataFinal: "2027-01-31" }, // Janeiro
    { dataInicial: "2027-02-01", dataFinal: "2027-02-28" }, // Fevereiro
    { dataInicial: "2027-03-01", dataFinal: "2027-03-31" }, // Março
    { dataInicial: "2027-04-01", dataFinal: "2027-04-30" }, // Abril
    { dataInicial: "2027-05-01", dataFinal: "2027-05-31" }, // Maio
    { dataInicial: "2027-06-01", dataFinal: "2027-06-30" }, // Junho
    { dataInicial: "2027-07-01", dataFinal: "2027-07-31" }, // Julho
    { dataInicial: "2027-08-01", dataFinal: "2027-08-31" }, // Agosto
    { dataInicial: "2027-09-01", dataFinal: "2027-09-30" }, // Setembro
    { dataInicial: "2027-10-01", dataFinal: "2027-10-31" }, // Outubro
    { dataInicial: "2027-11-01", dataFinal: "2027-11-30" }, // Novembro
    { dataInicial: "2027-12-01", dataFinal: "2027-12-31" }  // Dezembro
  ];


  datas2028: DatasAnaliseFaturamento[] = [
    { dataInicial: "2028-01-01", dataFinal: "2028-01-31" }, // Janeiro
    { dataInicial: "2028-02-01", dataFinal: "2028-02-29" }, // Fevereiro (Bissexto!)
    { dataInicial: "2028-03-01", dataFinal: "2028-03-31" }, // Março
    { dataInicial: "2028-04-01", dataFinal: "2028-04-30" }, // Abril
    { dataInicial: "2028-05-01", dataFinal: "2028-05-31" }, // Maio
    { dataInicial: "2028-06-01", dataFinal: "2028-06-30" }, // Junho
    { dataInicial: "2028-07-01", dataFinal: "2028-07-31" }, // Julho
    { dataInicial: "2028-08-01", dataFinal: "2028-08-31" }, // Agosto
    { dataInicial: "2028-09-01", dataFinal: "2028-09-30" }, // Setembro
    { dataInicial: "2028-10-01", dataFinal: "2028-10-31" }, // Outubro
    { dataInicial: "2028-11-01", dataFinal: "2028-11-30" }, // Novembro
    { dataInicial: "2028-12-01", dataFinal: "2028-12-31" }  // Dezembro
  ];


  datas2029: DatasAnaliseFaturamento[] = [
    { dataInicial: "2029-01-01", dataFinal: "2029-01-31" }, // Janeiro
    { dataInicial: "2029-02-01", dataFinal: "2029-02-28" }, // Fevereiro
    { dataInicial: "2029-03-01", dataFinal: "2029-03-31" }, // Março
    { dataInicial: "2029-04-01", dataFinal: "2029-04-30" }, // Abril
    { dataInicial: "2029-05-01", dataFinal: "2029-05-31" }, // Maio
    { dataInicial: "2029-06-01", dataFinal: "2029-06-30" }, // Junho
    { dataInicial: "2029-07-01", dataFinal: "2029-07-31" }, // Julho
    { dataInicial: "2029-08-01", dataFinal: "2029-08-31" }, // Agosto
    { dataInicial: "2029-09-01", dataFinal: "2029-09-30" }, // Setembro
    { dataInicial: "2029-10-01", dataFinal: "2029-10-31" }, // Outubro
    { dataInicial: "2029-11-01", dataFinal: "2029-11-30" }, // Novembro
    { dataInicial: "2029-12-01", dataFinal: "2029-12-31" }  // Dezembro
  ];


  datas2030: DatasAnaliseFaturamento[] = [
    { dataInicial: "2030-01-01", dataFinal: "2030-01-31" }, // Janeiro
    { dataInicial: "2030-02-01", dataFinal: "2030-02-28" }, // Fevereiro
    { dataInicial: "2030-03-01", dataFinal: "2030-03-31" }, // Março
    { dataInicial: "2030-04-01", dataFinal: "2030-04-30" }, // Abril
    { dataInicial: "2030-05-01", dataFinal: "2030-05-31" }, // Maio
    { dataInicial: "2030-06-01", dataFinal: "2030-06-30" }, // Junho
    { dataInicial: "2030-07-01", dataFinal: "2030-07-31" }, // Julho
    { dataInicial: "2030-08-01", dataFinal: "2030-08-31" }, // Agosto
    { dataInicial: "2030-09-01", dataFinal: "2030-09-30" }, // Setembro
    { dataInicial: "2030-10-01", dataFinal: "2030-10-31" }, // Outubro
    { dataInicial: "2030-11-01", dataFinal: "2030-11-30" }, // Novembro
    { dataInicial: "2030-12-01", dataFinal: "2030-12-31" }  // Dezembro
  ];


  criandoArraysGraficos() {
    this.ano2021Grafico = this.ano2021.slice(0, 12);
    this.ano2022Grafico = this.ano2022.slice(0, 12);
    this.ano2023Grafico = this.ano2023.slice(0, 12);
    this.ano2024Grafico = this.ano2024.slice(0, 12);
    this.ano2025Grafico = this.faturamentosAnoSelecionado.slice(0, 12);
    this.ano2026Grafico = this.ano2026.slice(0, 12);
    this.ano2027Grafico = this.ano2027.slice(0, 12);
    this.ano2028Grafico = this.ano2028.slice(0, 12);
    this.metaGrafico = this.meta.slice(0, 12);
    console.log(" esta criando array graficos")
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

  /////////////////////DESPESAS///////////////////////////////////////


  /////BUSCA DESPESAS DA EMPRESA PARA UM ANO ESCOHIDO////
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

    ////BUSCA OS FATURAMENTOS DO ANO ESCOLHIDO/////:
    this.buscaSomatoriaFaturamentoEntreDatas();
    this.despesasCasaEigreja();

    // 2. AGORA: Com a lista escolhida, fazemos a busca para cada período
    this.datasIniciaisEfinais.forEach((periodo, index) => {
      this.despesaService?.consultarDespesasFiltro(
        periodo.dataInicial,
        periodo.dataFinal,
        "EMPRESA",
        "TODOS"
      ).subscribe({
        next: (dados: Despesa[]) => {
          if (!dados || dados.length === 0) {
            // Cuidado: se você limpar aqui, o último mês vazio vai apagar os anteriores!
            console.log(`Mês ${index + 1} sem despesas.`);
          } else {
            this.dadosConsultaFiltro = dados;
            console.log("Busca realizada:", this.dadosConsultaFiltro);
            this.montaArrayTotalDespesasCadaMes(dados, index);
            
          }
        },
        error: (err) => {
          console.error("Erro ao buscar:", err);
        }
      });
    });
  }

 montaArrayTotalDespesasCadaMes(dados: Despesa[], index: number) {
  // 1. Soma o mês atual
  const totalDoMes = dados.reduce((soma, despesa) => {
    return soma + (+despesa.valor || 0);
  }, 0);
  this.totaisMensaisDespesas[index] = totalDoMes;

  // 2. Calcula o total anual (Gaveta 12)
  const totalDespesaAnual = this.totaisMensaisDespesas
    .slice(0, 12)
    .reduce((soma, valorMes) => soma + (valorMes || 0), 0);
  this.totaisMensaisDespesas[12] = totalDespesaAnual;

  // 3. Calcula a média mensal (Gaveta 13)
  // Primeiro: filtramos apenas os meses que são maiores que zero

  const mesesComDinheiro = this.totaisMensaisDespesas
    .slice(0, 12)
    .filter(valor => valor > 0);

  // Segundo: pegamos a quantidade desses meses
  const quantidadeDeMeses = mesesComDinheiro.length;

  // Terceiro: calculamos a média (só se a quantidade for maior que 0 para não dar erro!)
  const mediaMensal = quantidadeDeMeses > 0 ? totalDespesaAnual / quantidadeDeMeses : 0;
  
  this.totaisMensaisDespesas[13] = mediaMensal;

  // CALCULANDO CUSTO POR ORDEM DE SERVIÇO
  const custoMedioPorOS = totalDespesaAnual / this.totalOrdensServicosAnual
  this.totaisMensaisDespesas[14] = custoMedioPorOS;
  console.log(`**********************Total Equipamentos Ano: R$ ${custoMedioPorOS}`);

  //CALCULANDO SALDO BRUTO:

  // O map vai passar pelo faturamento de cada mês (0 a 11)
this.saldoBruto = this.faturamentosAnoSelecionado.map((faturamentoMensal, index) => {
  
  // Pegamos a despesa do mesmo mês usando o 'index'
  const despesaMensal = this.totaisMensaisDespesas[index] || 0;
  
  // Retornamos a conta: Faturamento - Despesa
  return faturamentoMensal - despesaMensal;
});

}

/////BUSCA DESPESAS DE CASA E IGREJA PARA CADA MES DO ANO ESCOLHIDO
despesasCasaEigreja(){
this.datasIniciaisEfinais.forEach((periodo, index) => {
      this.despesaService?.consultarDespesasFiltro(
        periodo.dataInicial,
        periodo.dataFinal,
        "CASA e IGREJA",
        "TODOS"
      ).subscribe({
        next: (dados: Despesa[]) => {
          if (!dados || dados.length === 0) {
            // Cuidado: se você limpar aqui, o último mês vazio vai apagar os anteriores!
            console.log(`Mês ${index + 1} sem despesas.`);
          } else {
            this.dadosConsultaFiltro = dados;
            console.log("Busca realizada:", this.dadosConsultaFiltro);
            this.montaArrayDespesasCasaEIgreja(dados, index);
            
          }
        },
        error: (err) => {
          console.error("Erro ao buscar:", err);
        }
      });
    });

}

montaArrayDespesasCasaEIgreja(dados: Despesa[], index: number){
// 1. Soma o mês atual
  const totalDoMes = dados.reduce((soma, despesa) => {
    return soma + (+despesa.valor || 0);
  }, 0);
  this.arraydespesasCasaEigreja[index] = totalDoMes;

  // 2. Calcula o total anual (Gaveta 12)
  const totalDespesaAnual = this.arraydespesasCasaEigreja
    .slice(0, 12)
    .reduce((soma, valorMes) => soma + (valorMes || 0), 0);
  this.arraydespesasCasaEigreja[12] = totalDespesaAnual;

  // 3. Calcula a média mensal (Gaveta 13)
  // Primeiro: filtramos apenas os meses que são maiores que zero

  const mesesComDinheiro = this.arraydespesasCasaEigreja
    .slice(0, 12)
    .filter(valor => valor > 0);

  // Segundo: pegamos a quantidade desses meses
  const quantidadeDeMeses = mesesComDinheiro.length;

  // Terceiro: calculamos a média (só se a quantidade for maior que 0 para não dar erro!)
  const mediaMensal = quantidadeDeMeses > 0 ? totalDespesaAnual / quantidadeDeMeses : 0;
  
  this.arraydespesasCasaEigreja[13] = mediaMensal;

}

///////////////////////////FATURAMENTO/////////////////////////////

buscaSomatoriaFaturamentoEntreDatas() {
    this.faturamentosAnoSelecionado = [];
    // Array auxiliar para armazenar as quantidades de cada mês
    const quantidadesMensais: number[] = [];

    this.datasIniciaisEfinais.forEach((periodo, index) => {
      
      // --- MÁGICA DE TRANSFORMAÇÃO AQUI ---
      // 1. Pegamos "2022-01-01", cortamos no "-", invertemos e grudamos: vira "01012022"
      const dataIniLimpa = periodo.dataInicial.split('-').reverse().join('');
      const dataFimLimpa = periodo.dataFinal.split('-').reverse().join('');

      // Enviamos as datas formatadas (sem hífens e na ordem ddMMyyyy)
      this.servico.buscaSomatorioFaturamento(dataIniLimpa, dataFimLimpa).subscribe({
        next: (data: SomatorioOs) => {
          // Armazena o valor financeiro e a quantidade nos respectivos índices
          this.faturamentosAnoSelecionado[index] = data.somatotaliq;
          quantidadesMensais[index] = data.qtOs;

          const respostasRecebidas = this.faturamentosAnoSelecionado.filter(v => v !== undefined).length;

          if (respostasRecebidas === 12) {
            const valoresMeses = this.faturamentosAnoSelecionado.slice(0, 12);

            // 1. Total Anual (Índice 12)
            const totalAnual = valoresMeses.reduce((acc, curr) => acc + (curr || 0), 0);
            this.faturamentosAnoSelecionado[12] = totalAnual;

            // 2. Média Mensal (Índice 13)
            const mesesComFaturamento = valoresMeses.filter(valor => valor > 0);
            this.faturamentosAnoSelecionado[13] = mesesComFaturamento.length > 0
              ? totalAnual / mesesComFaturamento.length
              : 0;

            // 3. Média por Equipamento (Índice 14)
            const totalEquipamentosAnual = quantidadesMensais.reduce((acc, curr) => acc + (curr || 0), 0);
            this.totalOrdensServicosAnual = totalEquipamentosAnual;
            console.log("**********************************total equipamentos anual em faturamento ",totalEquipamentosAnual )

            this.faturamentosAnoSelecionado[14] = totalEquipamentosAnual > 0
              ? totalAnual / totalEquipamentosAnual
              : 0;
              
            console.log("Valores finais processados:", this.faturamentosAnoSelecionado);
            console.log(`Total Anual: ${totalAnual} | Equipamentos: ${totalEquipamentosAnual} | Média/Eq: ${this.faturamentosAnoSelecionado[14]}`);
          }
        },
        error: (error) => {
          console.error(`Erro no mês ${index + 1}:`, error);
          this.faturamentosAnoSelecionado[index] = 0;
          quantidadesMensais[index] = 0;
        }
      });
    });
  }






}


  


