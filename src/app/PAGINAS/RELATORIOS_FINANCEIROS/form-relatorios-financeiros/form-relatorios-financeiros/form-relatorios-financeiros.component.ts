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
    private financeiroService: FinanceiroService
  ) { }


//////////////////////////BUSCA FATURAMENTO POR DATA DE FECHAMENTO//////////////////

buscaFaturamentoTotalEntreDatas(){
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


    statusSelecionado: string = "TODOS";
  tipoDataSelecionado: string = "fechamento";

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

  onButtonClick(){}

}
