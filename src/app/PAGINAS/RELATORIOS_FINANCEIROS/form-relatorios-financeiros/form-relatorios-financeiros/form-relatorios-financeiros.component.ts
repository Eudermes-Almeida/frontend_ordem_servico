import { SomatorioOs } from './../../../../modelo/SomatorioOs';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Cliente } from '../../../../modelo/Cliente';
import { Os } from '../../../../modelo/Os';
import { FormControl, FormGroup } from '@angular/forms';
import { ParametrosService } from '../../../../servico/parametros.service';
import { OrdemservicoService } from '../../../../servico/ordemservico.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Financeiro } from '../../../../modelo/Financeiro';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FinanceiroService } from '../../../../servico/financeiro.service';

@Component({
  selector: 'app-form-relatorios-financeiros',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule],
  templateUrl: './form-relatorios-financeiros.component.html',
  styleUrl: './form-relatorios-financeiros.component.css'
})
export class FormRelatoriosFinanceirosComponent {
  // CONFIGURA AS FUNÇÕES QUE SERÃO EXECUTADAS NA INICIALIZAÇÃO DA PÁGINA
  ngOnInit(): void {

  }


  //////////////////////////////////NOVAS VARIÁVEIS///////////////////////////////////////////////////
  arrayGeral: Financeiro[] = [];

  ////DATEPICKER:
  model: NgbDateStruct | undefined;
  model2: NgbDateStruct | undefined;

  dataFinalIntervalo: string = "";
  dataInicialIntervalo: string = "";
  arrayAprovadasOuReprovadasRemotamente: any[] = [];
  teste: string = "teste";
  spinnerLoading: boolean = false;


  constructor(
    private servico: OrdemservicoService,
    private financeiroService: FinanceiroService,
    private cdr: ChangeDetectorRef
  ) { }


  //////////////////////////BUSCA FATURAMENTO POR DATA DE FECHAMENTO//////////////////

  buscaFaturamentoTotalEntreDatas() {
    const dataInicio = this.converterDataParaFormatoLimpo(this.dataInicialIntervalo)
    const dataFim = this.converterDataParaFormatoLimpo(this.dataFinalIntervalo)
    const busca = "faturamentoTotal"
    this.buscaFechamentoOs(dataInicio, dataFim, busca);
  }

  converterDataParaFormatoLimpo(data: string): string {
    if (data && data.includes('-')) {
      const partes = data.split('-');
      const ano = partes[0];
      const mes = partes[1];
      const dia = partes[2];
      const dataFormatada = `${dia}${mes}${ano}`;
      return dataFormatada;
    }
    return '';
  }

  arrayFaturamentoTotal: any[] = [];

  buscaFechamentoOs(dataInicio: string, dataFim: string, busca: string): void {
    console.log("Entrou em busca relatorio")
    this.servico.buscaRelatoriosEntreDatas(dataInicio, dataFim, busca).subscribe(
      (data: any) => {
        switch (busca) {
          case "faturamentoTotal":
            this.arrayFaturamentoTotal = data;
            console.log(" array faturamento total ", this.arrayFaturamentoTotal)
            const memoFaturamentoTotal = this.servico.getData();
            console.log("memoria faturamento total ", memoFaturamentoTotal)
            break;
          default:
            console.warn(`Relatório ${busca} não reconhecido.`);
        }

      },
      (error) => {
        if (error.status === 404) {
          console.error(`Nenhum dado encontrado para o relatório ${busca}.`);
        } else {
          console.error(`Erro ao buscar relatório ${busca}:`, error);
        }
      }
    );
  }

  // Função para converter o objeto em string
  onDateInicial(date: NgbDateStruct) {
    // Formato Brasileiro: DD/MM/AAAA
    const dia = date.day.toString().padStart(2, '0');
    const mes = date.month.toString().padStart(2, '0');
    const ano = date.year;
    console.log(" Este é dia ", dia)
    this.dataInicialIntervalo = `${ano}-${mes}-${dia}`;
    console.log('Data salva como string:', this.dataInicialIntervalo);
  }

  onDateFinal(date: NgbDateStruct) {
    // Formato Brasileiro: DD/MM/AAAA
    const dia = date.day.toString().padStart(2, '0');
    const mes = date.month.toString().padStart(2, '0');
    const ano = date.year;
    this.dataFinalIntervalo = `${ano}-${mes}-${dia}`;
    console.log('Data salva como string:', this.dataFinalIntervalo);
  }




  // DEFINIÇÃO DO DICIONÁRIO DE DADOS: Inicializa a estrutura para todos os tipos necessários
  totaisFinanceiros: { [chave: string]: { total: number; qt: number; percentual: number } } = {
    "DINHEIRO": { total: 0, qt: 0, percentual: 0 },
    "PIX": { total: 0, qt: 0, percentual: 0 },
    "BOLETO": { total: 0, qt: 0, percentual: 0 },
    "BORDERO": { total: 0, qt: 0, percentual: 0 },
    "NAO FATURADO": { total: 0, qt: 0, percentual: 0 },
    "CARTEIRA": { total: 0, qt: 0, percentual: 0 } // Centralizado apenas aqui
  };


  buscaDadosParaPopularArrayGeral() {
    const dataInicio = this.converterDataParaFormatoLimpo(this.dataInicialIntervalo);
    const dataFim = this.converterDataParaFormatoLimpo(this.dataFinalIntervalo);
    const busca = "faturamentoTotal";

    this.servico.buscaRelatoriosEntreDatas(dataInicio, dataFim, busca).subscribe({
      next: (data: any) => {
        this.arrayFaturamentoTotal = data;
        this.buscarDadosFinanceiros();
      },
      error: (error) => {
        console.error(`Erro ao buscar relatório ${busca}:`, error);
        this.buscarDadosFinanceiros();
      }
    });
  }

  statusSelecionado: string = "TODOS";
  tipoDataSelecionado: string = "fechamento";

  private buscarDadosFinanceiros() {
    this.financeiroService.getRegistrosFiltrados(
      this.dataInicialIntervalo,
      this.dataFinalIntervalo,
      this.statusSelecionado,
      this.tipoDataSelecionado
    ).subscribe({
      next: (dados: Financeiro[]) => {
        this.arrayGeral = dados;
        console.log('Filtro dinâmico carregado com sucesso:', this.arrayGeral);

        // CORRIGIDO: Agora chama a função genérica que processa tudo de uma vez só
        this.calcularTotaisFinanceiros();
        this.calculaTotalPago();
        this.calculaCustoBancarioTotal();
        this.calculoFechamentoMenosContabilizado();
        this.buscaTudoMenosPago();
      },
      error: (erro) => {
        console.error('Erro na busca avançada:', erro);
        if (erro.status === 404) {
          alert('Nenhum registro financeiro localizado para os critérios informados.');
        } else {
          alert('Erro interno ao processar a busca no servidor.');
        }
      }
    });
  }

  // MÉTODO GENÉRICO ÚNICO: Processa todos os meios de pagamento sem duplicar código
  calcularTotaisFinanceiros(): void {
    // 1. Reseta o dicionário antes de recalcular
    Object.keys(this.totaisFinanceiros).forEach(chave => {
      this.totaisFinanceiros[chave] = { total: 0, qt: 0, percentual: 0 };
    });

    // 2. Loop único com prioridade correta
    this.arrayGeral.forEach((os) => {
      // REGRA: Se tiver tipoPagamento usa ele. Se não tiver (como no NAO FATURADO), usa o statusGeral
      let tipoOriginal = os.tipoPagamento ? os.tipoPagamento : os.statusGeral;

      const tipoTratado = tipoOriginal?.toUpperCase().trim();

      // Soma uma única vez na chave correspondente
      if (tipoTratado && this.totaisFinanceiros[tipoTratado] && os.totaliq) {
        this.totaisFinanceiros[tipoTratado].total += Number(os.totaliq);
        this.totaisFinanceiros[tipoTratado].qt++;
      }
    });

    // 3. Captura o faturamento total com segurança
    let totalFaturamentoPeriodo = 0;
    if (this.arrayFaturamentoTotal) {
      if (Array.isArray(this.arrayFaturamentoTotal) && this.arrayFaturamentoTotal[0].somatoriaDTO) {
        totalFaturamentoPeriodo = Number(this.arrayFaturamentoTotal[0].somatoriaDTO.somatotaliq);
      } else if (this.arrayFaturamentoTotal[0].somatoriaDTO) {
        totalFaturamentoPeriodo = Number(this.arrayFaturamentoTotal[0].somatoriaDTO.somatotaliq);
      }
    }

    // 4. Calcula os percentuais finais
    if (totalFaturamentoPeriodo > 0) {
      Object.keys(this.totaisFinanceiros).forEach((tipo) => {
        const totalDoTipo = this.totaisFinanceiros[tipo].total;
        this.totaisFinanceiros[tipo].percentual = (totalDoTipo / totalFaturamentoPeriodo) * 100;
      });
    }

    console.log("Cálculos consolidados e sem duplicidade:", this.totaisFinanceiros);
  }

  onButtonClick() { }

  totalPago: number = 0;
  qttotalPago: number = 0;
  percentualTotalPago: number = 0;
  calculaTotalPago() {
    this.qttotalPago = 0;
    this.totalPago = this.arrayGeral.reduce((acc, os) => {
      if (os.statusGeral === "PAGO") {
        this.qttotalPago++;
        return acc + (+os.totaliq || 0);
      }
      return acc;
    }, 0);

    const faturamentoTotalGeral = this.arrayFaturamentoTotal?.[0]?.somatoriaDTO?.somatotaliq;
    if (faturamentoTotalGeral && +faturamentoTotalGeral > 0) {
      this.percentualTotalPago = (this.totalPago / +faturamentoTotalGeral) * 100;
    } else {
      this.percentualTotalPago = 0;
    }
    this.cdr.detectChanges();
  }



  totalCustoBancario: number = 0;
  qtCustoBancario: number = 0;
  percentualCustoBancario: number = 0;
  calculaCustoBancarioTotal() {

    this.qtCustoBancario = 0;
    this.totalCustoBancario = this.arrayGeral.reduce((acc, os) => {

      if (os.custoBancarioTotal) {
        acc = acc + (+os.custoBancarioTotal)

        if (os.custoBancarioTotal !== "0.00") { this.qtCustoBancario++ }
        return acc
      } return acc

    }, 0)

    console.log(" Este é o custo bancario total ", this.totalCustoBancario)
    const faturamentoTotalGeral = this.arrayFaturamentoTotal?.[0]?.somatoriaDTO?.somatotaliq;
    this.percentualCustoBancario = (this.totalCustoBancario / +faturamentoTotalGeral) * 100;
  }

  totalContabilizado: number = 0;
  fechamentoMenosContatilizado: number = 0;
  qtContabilizado: number = 0;
  percentualContabizadoDeFaturamentoTotal: string = ""
  calculoFechamentoMenosContabilizado() {
    this.qtContabilizado = 0;
    this.totalContabilizado = this.arrayGeral.reduce((acc, os) => {
      acc = acc + (+os.totaliq)
      return acc
    }, 0)

    this.qtContabilizado = this.arrayFaturamentoTotal.length - this.arrayGeral.length
    const faturamentoTotalGeral = this.arrayFaturamentoTotal?.[0]?.somatoriaDTO?.somatotaliq;
    this.fechamentoMenosContatilizado = faturamentoTotalGeral - this.totalContabilizado
    this.percentualContabizadoDeFaturamentoTotal = ((this.arrayGeral.length / this.arrayFaturamentoTotal.length) * 100).toFixed(2)
  }


  ////////////////////////////TOTAL REMANECENTES////////////////////////////////////////

  arrayTudao: Financeiro[] = [];

  buscaTudoMenosPago() {
    this.financeiroService.buscaTudoMenosPago().subscribe({
      next: (data: any) => {
        this.arrayTudao = data;
        console.log(" Este é o tudão ", this.arrayTudao)
        this.boletoEmDia();
        this.borderoEmDia();
        this.boletoAtrazado();
        this.borderoAtrazado();
        this.naoFaturado();
        this.Carteira();
        this.totalBorderoGeral();
        this.boletoVencimentoProximos30Dias();
      },
      error: (error) => {
        console.error(`Erro ao buscar tudão`, error);
      }
    });
  }


  totalBoletoEmDia: number = 0;
  qtBoletoEmDia: number = 0;

  boletoEmDia() {
    this.qtBoletoEmDia = 0;

    this.totalBoletoEmDia = this.arrayGeral.reduce((acc, os) => {

      if (os.tipoPagamento !== "BOLETO") {
        return acc;
      }

      // Parcela 1
      if (os.valorParcela1 && (os.statusParcela1 === "EM DIA")) {
        acc = acc + (+os.valorParcela1 || 0);
        this.qtBoletoEmDia++;
        console.log(`OS: ${os.os} | Parcela 1: ${os.statusParcela1} | Valor: ${os.valorParcela1}`);
      }

      // Parcela 2
      if (os.valorParcela2 && (os.statusParcela2 === "EM DIA")) {
        acc = acc + (+os.valorParcela2 || 0);
        this.qtBoletoEmDia++;
        console.log(`OS: ${os.os} | Parcela 2: ${os.statusParcela2} | Valor: ${os.valorParcela2}`);
      }

      // Parcela 3
      if (os.valorParcela3 && (os.statusParcela3 === "EM DIA")) {
        acc = acc + (+os.valorParcela3 || 0);
        this.qtBoletoEmDia++;
        console.log(`OS: ${os.os} | Parcela 3: ${os.statusParcela3} | Valor: ${os.valorParcela3}`);
      }

      return acc;
    }, 0);

    this.cdr.detectChanges(); // Garante a atualização imediata no HTML do Angular

  }


  totalBorderoEmDia: number = 0;
  qtBorderoEmDia: number = 0;

  borderoEmDia() {
    this.qtBorderoEmDia = 0;

    this.totalBorderoEmDia = this.arrayGeral.reduce((acc, os) => {

      if (os.tipoPagamento !== "BORDERO") {
        return acc;
      }

      // Parcela 1
      if (os.valorParcela1 && (os.statusParcela1 === "EM DIA")) {
        acc = acc + (+os.valorParcela1 || 0);
        this.qtBorderoEmDia++;
        console.log(`OS: ${os.os} | Parcela 1: ${os.statusParcela1} | Valor: ${os.valorParcela1}`);
      }

      // Parcela 2
      if (os.valorParcela2 && (os.statusParcela2 === "EM DIA")) {
        acc = acc + (+os.valorParcela2 || 0);
        this.qtBorderoEmDia++;
        console.log(`OS: ${os.os} | Parcela 2: ${os.statusParcela2} | Valor: ${os.valorParcela2}`);
      }

      // Parcela 3
      if (os.valorParcela3 && (os.statusParcela3 === "EM DIA")) {
        acc = acc + (+os.valorParcela3 || 0);
        this.qtBorderoEmDia++;
        console.log(`OS: ${os.os} | Parcela 3: ${os.statusParcela3} | Valor: ${os.valorParcela3}`);
      }

      return acc;
    }, 0);

    this.cdr.detectChanges(); // Garante a atualização imediata no HTML do Angular

  }

  totalBoletoAtrazado: number = 0;
  qtBoletoAtrazado: number = 0;

  boletoAtrazado() {
    this.qtBoletoAtrazado = 0;

    this.totalBoletoAtrazado = this.arrayGeral.reduce((acc, os) => {

      if (os.tipoPagamento !== "BOLETO") {
        return acc;
      }

      // Parcela 1
      if (os.valorParcela1 && (os.statusParcela1 === "ATRAZADO")) {
        acc = acc + (+os.valorParcela1 || 0);
        this.qtBoletoAtrazado++;
        console.log(`OS: ${os.os} | Parcela 1: ${os.statusParcela1} | Valor: ${os.valorParcela1}`);
      }

      // Parcela 2
      if (os.valorParcela2 && (os.statusParcela2 === "ATRAZADO")) {
        acc = acc + (+os.valorParcela2 || 0);
        this.qtBoletoAtrazado++;
        console.log(`OS: ${os.os} | Parcela 2: ${os.statusParcela2} | Valor: ${os.valorParcela2}`);
      }

      // Parcela 3
      if (os.valorParcela3 && (os.statusParcela3 === "ATRAZADO")) {
        acc = acc + (+os.valorParcela3 || 0);
        this.qtBoletoAtrazado++;
        console.log(`OS: ${os.os} | Parcela 3: ${os.statusParcela3} | Valor: ${os.valorParcela3}`);
      }

      return acc;
    }, 0);

    this.cdr.detectChanges(); // Garante a atualização imediata no HTML do Angular
  }

  totalBorderoAtrazado: number = 0;
  qtBorderoAtrazado: number = 0;

  borderoAtrazado() {
    this.qtBorderoAtrazado = 0;

    this.totalBorderoAtrazado = this.arrayGeral.reduce((acc, os) => {

      if (os.tipoPagamento !== "BORDERO") {
        return acc;
      }

      // Parcela 1
      if (os.valorParcela1 && (os.statusParcela1 === "ATRAZADO")) {
        acc = acc + (+os.valorParcela1 || 0);
        this.qtBorderoAtrazado++;
        console.log(`OS: ${os.os} | Parcela 1: ${os.statusParcela1} | Valor: ${os.valorParcela1}`);
      }

      // Parcela 2
      if (os.valorParcela2 && (os.statusParcela2 === "ATRAZADO")) {
        acc = acc + (+os.valorParcela2 || 0);
        this.qtBorderoAtrazado++;
        console.log(`OS: ${os.os} | Parcela 2: ${os.statusParcela2} | Valor: ${os.valorParcela2}`);
      }

      // Parcela 3
      if (os.valorParcela3 && (os.statusParcela3 === "ATRAZADO")) {
        acc = acc + (+os.valorParcela3 || 0);
        this.qtBorderoAtrazado++;
        console.log(`OS: ${os.os} | Parcela 3: ${os.statusParcela3} | Valor: ${os.valorParcela3}`);
      }

      return acc;
    }, 0);

    this.cdr.detectChanges(); // Garante a atualização imediata no HTML do Angular
  }

  totalNaoFaturado: number = 0;
  qtNaoFaturado: number = 0;

  naoFaturado() {
    this.qtNaoFaturado = 0;
    this.totalNaoFaturado = this.arrayTudao.reduce((acc, os) => {
      if (os.statusGeral === "NAO FATURADO") {
        this.qtNaoFaturado++
        acc = acc + (+os.totaliq)
        return acc
      }
      return acc
    }, 0)
  }

  totalCarteira: number = 0;
  qtCarteira: number = 0;

  Carteira() {
    this.qtCarteira = 0;
    this.totalCarteira = this.arrayTudao.reduce((acc, os) => {
      if (os.statusGeral === "CARTEIRA") {
        this.qtCarteira++
        acc = acc + (+os.totaliq)
        return acc
      }
      return acc
    }, 0)
  }


  totalBorderoTudo: number = 0;
  qtBorderoTudo: number = 0;

  totalBorderoGeral() {
    this.qtBorderoTudo = 0;

    this.totalBorderoTudo = this.arrayTudao.reduce((acc, os) => {

      if (os.tipoPagamento !== "BORDERO") {
        return acc;
      }

      // Parcela 1
      if (os.valorParcela1 && (os.statusParcela1 === "EM DIA" || os.statusParcela1 === "ATRAZADO")) {
        acc = acc + (+os.valorParcela1 || 0);
        this.qtBorderoTudo++;
        console.log(`OS: ${os.os} | Parcela 1: ${os.statusParcela1} | Valor: ${os.valorParcela1}`);
      }

      // Parcela 2
      if (os.valorParcela2 && (os.statusParcela2 === "EM DIA" || os.statusParcela2 === "ATRAZADO")) {
        acc = acc + (+os.valorParcela2 || 0);
        this.qtBorderoTudo++;
        console.log(`OS: ${os.os} | Parcela 2: ${os.statusParcela2} | Valor: ${os.valorParcela2}`);
      }

      // Parcela 3
      if (os.valorParcela3 && (os.statusParcela3 === "EM DIA" || os.statusParcela3 === "ATRAZADO")) {
        acc = acc + (+os.valorParcela3 || 0);
        this.qtBorderoTudo++;
        console.log(`OS: ${os.os} | Parcela 3: ${os.statusParcela3} | Valor: ${os.valorParcela3}`);
      }

      return acc;
    }, 0);

    this.cdr.detectChanges(); // Garante a atualização imediata no HTML do Angular

    console.log("ESte é o valor total de bordero final: ", this.totalBorderoTudo);
    console.log("Quantidade total de parcelas válidas: ", this.qtBorderoTudo);
  }


  boletoVencimento30Dias: number = 0;
  qtBoletosVencimento30Dias: number = 0;

  boletoVencimentoProximos30Dias() {

    this.qtBoletosVencimento30Dias = 0;
    //////DATA FUTURA = HOJE + 30 DIAS:
    const data = new Date();
    data.setDate(data.getDate() + 30);
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const dataFutura = `${ano}-${mes}-${dia}`;

    console.log(" Esta é a data futura ", dataFutura)

    this.boletoVencimento30Dias = this.arrayTudao.reduce((acc, os) => {


      if (os.tipoPagamento === "BOLETO" && os.vencimento1 && os.vencimento1 <= dataFutura){
        this.qtBoletosVencimento30Dias ++
        console.log(" ESte é o valor da parcela 1************* ", os.valorParcela1)
        return acc + (+os.valorParcela1)
      }

      if (os.tipoPagamento === "BOLETO" && os.vencimento2 && os.vencimento2 <= dataFutura){
        this.qtBoletosVencimento30Dias ++
        console.log(" ESte é o valor da parcela 2************* ", os.valorParcela2)
        return acc + (+os.valorParcela2)
      }

      if (os.tipoPagamento === "BOLETO" && os.vencimento3 && os.vencimento3 <= dataFutura){
        this.qtBoletosVencimento30Dias ++
        console.log(" ESte é o valor da parcela 3************* ", os.valorParcela3)
        return acc + (+os.valorParcela3)
      }

      return acc
    }, 0)

    console.log(" Este é valor que irá vencer no próximo 30 dias ", this.boletoVencimento30Dias)

  }




}
