
import { ChangeDetectorRef, Component, ElementRef, ViewChild, OnInit } from '@angular/core'; // Adicionado OnInit aqui
import { OrdemservicoService } from '../../../../servico/ordemservico.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Financeiro } from '../../../../modelo/Financeiro';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FinanceiroService } from '../../../../servico/financeiro.service';

// Força o TypeScript a entender que 'bootstrap' existe globalmente na janela do navegador
const bootstrap = (window as any).bootstrap;


@Component({
  selector: 'app-form-relatorios-financeiros',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule],
  templateUrl: './form-relatorios-financeiros.component.html',
  styleUrl: './form-relatorios-financeiros.component.css'
})
export class FormRelatoriosFinanceirosComponent {
 ngOnInit(): void { 
    // Captura os elementos da tela
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    
    // Array.from resolve o erro TS2488 (não precisa do operador de espalhar ...)
    if (bootstrap && bootstrap.Tooltip) {
      Array.from(tooltipTriggerList).forEach(tooltipTriggerEl => {
        new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
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

  qtOsfechadas: number = 0;
  arrayFaturamentoTotal: any[] = [];

  // Função para converter o objeto em string
  onDateInicial(date: NgbDateStruct) {
    // Formato Brasileiro: DD/MM/AAAA
    const dia = date.day.toString().padStart(2, '0');
    const mes = date.month.toString().padStart(2, '0');
    const ano = date.year;

    this.dataInicialIntervalo = `${ano}-${mes}-${dia}`;

  }

  onDateFinal(date: NgbDateStruct) {
    // Formato Brasileiro: DD/MM/AAAA
    const dia = date.day.toString().padStart(2, '0');
    const mes = date.month.toString().padStart(2, '0');
    const ano = date.year;
    this.dataFinalIntervalo = `${ano}-${mes}-${dia}`;

  }

  // DEFINIÇÃO DO DICIONÁRIO DE DADOS: Inicializa a estrutura para todos os tipos necessários
  totaisFinanceiros: { [chave: string]: { total: number; qt: number; percentual: number } } = {
    "DINHEIRO": { total: 0, qt: 0, percentual: 0 },
    "PIX": { total: 0, qt: 0, percentual: 0 },
    "BOLETO": { total: 0, qt: 0, percentual: 0 },
    "BORDERO": { total: 0, qt: 0, percentual: 0 },
    "NAO FATURADO": { total: 0, qt: 0, percentual: 0 },
    "CARTEIRA": { total: 0, qt: 0, percentual: 0 },
    "CARTAO DEBITO": { total: 0, qt: 0, percentual: 0 },
    "CARTAO CREDITO": { total: 0, qt: 0, percentual: 0 }
  };


  buscaDadosParaPopularArrayGeral() {
    const dataInicio = this.converterDataParaFormatoLimpo(this.dataInicialIntervalo);
    const dataFim = this.converterDataParaFormatoLimpo(this.dataFinalIntervalo);
    const busca = "faturamentoTotal";

    this.servico.buscaRelatoriosEntreDatas(dataInicio, dataFim, busca).subscribe({
      next: (data: any) => {
        this.arrayFaturamentoTotal = data;

        //////pega só a quantidade de os com valor:
        this.arrayFaturamentoTotal.forEach((os) => {
          if (Number(os.totaliq) > 0) {
            this.qtOsfechadas++
          }
        })
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

  buscarDadosFinanceiros() {
    this.financeiroService.getRegistrosFiltrados(
      this.dataInicialIntervalo,
      this.dataFinalIntervalo,
      this.statusSelecionado,
      this.tipoDataSelecionado
    ).subscribe({
      next: (dados: Financeiro[]) => {
        this.arrayGeral = dados;


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


  }

  onButtonClick() { }

  totalPago: number = 0;
  qttotalPago: number = 0;
  percentualTotalPago: number = 0;
 calculaTotalPago() {
  this.qttotalPago = 0;

  this.totalPago = this.arrayGeral.reduce((acc, os) => {
    
    // 1. DINHEIRO ou PIX
    if (os.tipoPagamento === "DINHEIRO" || os.tipoPagamento === "PIX") {
      this.qttotalPago++;
      return acc + (+os.totaliq || 0);
    }

    // 2. BORDERÔ ou CARTÕES
    if (os.tipoPagamento === "BORDERO" || os.tipoPagamento === "CARTAO DEBITO" || os.tipoPagamento === "CARTAO CREDITO") {
      this.qttotalPago++;
      return acc + (+os.valorLiquidoCreditado || 0);
    }

    // 3. BOLETO (Suas comparações de texto originais continuam aqui)
    if (os.tipoPagamento === "BOLETO") {
      let somaBoletosDaOS = 0;

      // Parcela 1
      if (os.valorParcela1 && os.statusParcela1 === "PAGO" && os.vencimento1 >= this.dataInicialIntervalo && os.vencimento1 <= this.dataFinalIntervalo) {
        this.qttotalPago++;
        somaBoletosDaOS += +os.valorParcela1;
      }

      // Parcela 2
      if (os.valorParcela2 && os.statusParcela2 === "PAGO" && os.vencimento2 >= this.dataInicialIntervalo && os.vencimento2 <= this.dataFinalIntervalo) {
        this.qttotalPago++;
        somaBoletosDaOS += +os.valorParcela2;
      }

      // Parcela 3
      if (os.valorParcela3 && os.statusParcela3 === "PAGO" && os.vencimento3 >= this.dataInicialIntervalo && os.vencimento3 <= this.dataFinalIntervalo) {
        this.qttotalPago++;
        somaBoletosDaOS += +os.valorParcela3;
      }

      // RETORNO OBRIGATÓRIO DO BOLETO: Soma o que achou nesta OS ao total acumulado
      return acc + somaBoletosDaOS;
    }

    // RETORNO OBRIGATÓRIO GERAL: Se a OS não for nenhum dos tipos acima, 
    // apenas passa o valor acumulado para a próxima OS da lista sem quebrar
    return acc;
  }, 0);

  // Cálculo do percentual final
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


    const faturamentoTotalGeral = this.arrayFaturamentoTotal?.[0]?.somatoriaDTO?.somatotaliq;
    this.percentualCustoBancario = (this.totalCustoBancario / +faturamentoTotalGeral) * 100;
  }

  totalContabilizado: number = 0;
  qtContabilizado: number = 0;
  percentualContabizadoDeFaturamentoTotal: string = ""
  calculoFechamentoMenosContabilizado() {
    this.qtContabilizado = 0;
    this.totalContabilizado = this.arrayGeral.reduce((acc, os) => {
      acc = acc + (+os.totaliq)
      return acc
    }, 0)

    this.qtContabilizado = this.arrayGeral.length
    const faturamentoTotalGeral = this.arrayFaturamentoTotal?.[0]?.somatoriaDTO?.somatotaliq;

    this.percentualContabizadoDeFaturamentoTotal = ((this.arrayGeral.length / this.arrayFaturamentoTotal.length) * 100).toFixed(2)
  }


  ////////////////////////////TOTAL REMANECENTES////////////////////////////////////////

  arrayTudao: Financeiro[] = [];

  buscaTudoMenosPago() {
    this.financeiroService.buscaTudoMenosPago().subscribe({
      next: (data: any) => {
        this.arrayTudao = data;

        this.boletoEmDia();
        this.borderoEmDia();
        this.boletoAtrazado();
        this.borderoAtrazado();
        this.naoFaturado();
        this.Carteira();
        this.totalBorderoGeral();
        this.boletoVencimentoProximos30Dias();
        this.borderoVencimentoProximos30Dias();
        this.totalAindaAreceber();
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

      }

      // Parcela 2
      if (os.valorParcela2 && (os.statusParcela2 === "EM DIA")) {
        acc = acc + (+os.valorParcela2 || 0);
        this.qtBoletoEmDia++;

      }

      // Parcela 3
      if (os.valorParcela3 && (os.statusParcela3 === "EM DIA")) {
        acc = acc + (+os.valorParcela3 || 0);
        this.qtBoletoEmDia++;

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

      }

      // Parcela 2
      if (os.valorParcela2 && (os.statusParcela2 === "EM DIA")) {
        acc = acc + (+os.valorParcela2 || 0);
        this.qtBorderoEmDia++;

      }

      // Parcela 3
      if (os.valorParcela3 && (os.statusParcela3 === "EM DIA")) {
        acc = acc + (+os.valorParcela3 || 0);
        this.qtBorderoEmDia++;

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

      }

      // Parcela 2
      if (os.valorParcela2 && (os.statusParcela2 === "ATRAZADO")) {
        acc = acc + (+os.valorParcela2 || 0);
        this.qtBoletoAtrazado++;

      }

      // Parcela 3
      if (os.valorParcela3 && (os.statusParcela3 === "ATRAZADO")) {
        acc = acc + (+os.valorParcela3 || 0);
        this.qtBoletoAtrazado++;

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

      }

      // Parcela 2
      if (os.valorParcela2 && (os.statusParcela2 === "ATRAZADO")) {
        acc = acc + (+os.valorParcela2 || 0);
        this.qtBorderoAtrazado++;

      }

      // Parcela 3
      if (os.valorParcela3 && (os.statusParcela3 === "ATRAZADO")) {
        acc = acc + (+os.valorParcela3 || 0);
        this.qtBorderoAtrazado++;

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

      }

      // Parcela 2
      if (os.valorParcela2 && (os.statusParcela2 === "EM DIA" || os.statusParcela2 === "ATRAZADO")) {
        acc = acc + (+os.valorParcela2 || 0);
        this.qtBorderoTudo++;

      }

      // Parcela 3
      if (os.valorParcela3 && (os.statusParcela3 === "EM DIA" || os.statusParcela3 === "ATRAZADO")) {
        acc = acc + (+os.valorParcela3 || 0);
        this.qtBorderoTudo++;

      }

      return acc;
    }, 0);

    this.cdr.detectChanges(); // Garante a atualização imediata no HTML do Angular
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

    this.boletoVencimento30Dias = this.arrayTudao.reduce((acc, os) => {

      if (os.tipoPagamento === "BOLETO" && os.vencimento1 && os.vencimento1 <= dataFutura) {
        this.qtBoletosVencimento30Dias++
        return acc + (+os.valorParcela1)
      }

      if (os.tipoPagamento === "BOLETO" && os.vencimento2 && os.vencimento2 <= dataFutura) {
        this.qtBoletosVencimento30Dias++
        return acc + (+os.valorParcela2)
      }

      if (os.tipoPagamento === "BOLETO" && os.vencimento3 && os.vencimento3 <= dataFutura) {
        this.qtBoletosVencimento30Dias++
        return acc + (+os.valorParcela3)
      }

      return acc
    }, 0)

  }

  borderoVencimento30Dias: number = 0;
  qtBorderoVencimento30Dias: number = 0;

  borderoVencimentoProximos30Dias() {
    this.qtBorderoVencimento30Dias = 0;
    //////DATA FUTURA = HOJE + 30 DIAS:
    const data = new Date();
    data.setDate(data.getDate() + 30);
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const dataFutura = `${ano}-${mes}-${dia}`;

    this.borderoVencimento30Dias = this.arrayTudao.reduce((acc, os) => {

      if (os.tipoPagamento === "BORDERO" && os.vencimento1 && os.vencimento1 <= dataFutura) {
        this.qtBorderoVencimento30Dias++

        return acc + (+os.valorParcela1)
      }

      if (os.tipoPagamento === "BORDERO" && os.vencimento2 && os.vencimento2 <= dataFutura) {
        this.qtBorderoVencimento30Dias++

        return acc + (+os.valorParcela2)
      }

      if (os.tipoPagamento === "BORDERO" && os.vencimento3 && os.vencimento3 <= dataFutura) {
        this.qtBorderoVencimento30Dias++

        return acc + (+os.valorParcela3)
      }
      return acc
    }, 0)

  }


  totalAreceber: number = 0;
  qtTotalAreceber: number = 0;

  totalAindaAreceber() {
    this.qtTotalAreceber = 0;

    this.totalAreceber = this.arrayTudao.reduce((acc, os) => {

      if (os.tipoPagamento === "BORDERO") {
        return acc;
      }

      // Parcela 1
      if (os.valorParcela1) {
        acc = acc + (+os.valorParcela1 || 0);
        this.qtTotalAreceber++;

      }

      // Parcela 2
      if (os.valorParcela2) {
        acc = acc + (+os.valorParcela2 || 0);
        this.qtTotalAreceber++;

      }

      // Parcela 3
      if (os.valorParcela3) {
        acc = acc + (+os.valorParcela3 || 0);
        this.qtTotalAreceber++;

      }

      if (os.tipoPagamento !== "BOLETO" && os.tipoPagamento !== "BORDERO") {
        this.qtTotalAreceber++;
        acc = acc + (+os.totaliq || 0)
        return acc
      }

      return acc;
    }, 0);

    this.cdr.detectChanges(); // Garante a atualização imediata no HTML do Angular

  }

  

}
                  