import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Cliente } from '../../../../modelo/Cliente';
import { Os } from '../../../../modelo/Os';
import { FormControl, FormGroup } from '@angular/forms';
import { ParametrosService } from '../../../../servico/parametros.service';
import { OrdemservicoService } from '../../../../servico/ordemservico.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-relatorios-financeiros',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-relatorios-financeiros.component.html',
  styleUrl: './form-relatorios-financeiros.component.css'
})
export class FormRelatoriosFinanceirosComponent {
   // CONFIGURA AS FUNÇÕES QUE SERÃO EXECUTADAS NA INICIALIZAÇÃO DA PÁGINA
    ngOnInit(): void {
      this.buscaEescreveDatas();
    }
  
    ///BUSCA DATASNA MEMORIA E ESCREVE NO INPUT
    buscaEescreveDatas() {
      this.dataInicio = this.servico.getDataInicio();
      this.dataFim = this.servico.getDataFim();
      this.formulario.patchValue({ datainicial: this.dataInicio });
      this.formulario.patchValue({ datafinal: this.dataFim });
    }
  
  
  
    @ViewChild('numOsInput') numOsInput!: ElementRef;
  
    cliente: Cliente = new Cliente();
    os: Os = new Os();
  
    objetocliente: Cliente[] = [];
    objetoOs: Os[] = [];
  
    dataInicio: string = "";
    dataFim: string = "";
    variavelEnviada: string = ""
    isLoading: boolean = false;
    currentColor: string = 'white';
    currentColorAprovadas: string = 'white';
    currentColorNaoAprovadas: string = 'white';
    private intervalId: any;
    spinnerLoading: boolean = false
  
  
  
    relatorios: string[] = ["faturamentoTotal", "faturamentoNobreak", "faturamentoManutencaoNobreak", "faturamentoManutencaoNobreakAbaixo3kva",
      "faturamentoManutencaoNobreakAcima3kva", "vendaNobreakNovo", "vendaNobreakSemiNovo", "nobreakInviavel", "nobreakOrcamentoNaoAprovado",
      "nobreakGarantiaLoja", "nobreakGarantiaFabrica", "vendaBateriaAvulsa", "vendaSucataBateria", "faturamentoMonitor", "faturamentoManutencaoMonitor",
      "vendaMonitorSemiNovo", "monitorInviavel", "monitorOrcamentoNaoAprovado", "monitorGarantiaLoja", "faturamentoOutroEquipamento", "entradaEquipamento",
      "orcamentoNoPeriodo", "tecnicoEudermes", "tecnicoVinicius", "tecnicoLeonardo", "tecnicoRafael", "tecnicoGabriel"];
  
    status: string[] = ["aberta", "pronta", "passarOrcamento", "aguardandoAprovacao", "aprovadas", "naoAprovadas", "baixadas", "garantiaLojaAindaNoLaboratorio",
      "garantiaFabricaAindaNoLaboratorio", "emAnalise", "osImpressaMasNaoFechada"]
  
    // Variáveis para armazenar os resultados
    arrayFaturamentoTotal: any[] = [];
    faturamentoTotalJson: string = "";
    arrayFaturamentoNobreak: any[] = [];
    arrayFaturamentoManutencaoNobreak: any[] = [];
    arrayFaturamentoManutencaoNobreakAbaixo3kva: any[] = [];
    arrayFaturamentoManutencaoNobreakAcima3kva: any[] = [];
    arrayVendaNobreakNovo: any[] = [];
    arrayVendaNobreakSemiNovo: any[] = [];
    arrayNobreakInviavel: any[] = [];
    arrayNobreakOrcamentoNaoAprovado: any[] = [];
    arrayNobreakGarantiaLoja: any[] = [];
    arrayNobreakGarantiaFabrica: any[] = [];
    arrayVendaBateriaAvulsa: any[] = [];
    arrayVendaSucataBateria: any[] = [];
    arrayFaturamentoMonitor: any[] = [];
    arrayFaturamentoManutencaoMonitor: any[] = [];
    arrayVendaMonitorSemiNovo: any[] = [];
    arrayMonitorInviavel: any[] = [];
    arrayMonitorOrcamentoNaoAprovado: any[] = [];
    arrayMonitorGarantiaLoja: any[] = [];
    arrayFaturamentoOutroEquipamento: any[] = [];
    arrayEntradaEquipamento: any[] = [];
    arrayOrcamentoNoPeriodo: any[] = [];
    arrayComissaoTecnicos: any[] = [];
    arrayTecnicoEudermes: any[] = [];
    arrayTecnicoVinicius: any[] = [];
    arrayTecnicoLeonardo: any[] = [];
    arrayTecnicoRafael: any[] = [];
    arrayTecnicoGabriel: any[] = [];
    arrayAprovadasOuReprovadasRemotamente: any[] = [];
  
    /// array de status:
  
    arrayStatusaberta: any[] = [];
    arrayStatusPronta: any[] = [];
    arrayStatusPassarOrcamento: any[] = [];
    arrayStatusAguardandoAprovacao: any[] = [];
    arrayStatusAprovadas: any[] = [];
    arrayStatusNaoAprovadas: any[] = [];
    arrayStatusBaixadas: any[] = [];
    arrayStatusGarantiaLojaAindaNoLaboratorio: any[] = [];
    arrayStatusGarantiaFabricaAindaNoLaboratorio: any[] = [];
    arrayStatusEmAnalise: any[] = [];
    arrayStatusOsImpressaMasNaoFechada: any[] = [];
  
    ///////////CONTROLE DE RENDERIZAÇÃO/////////
  
    intervalGeral: any;
    intervalAprovadas: any;
    intervalNaoAprovadas: any;
  
  
  
    // CONFIGURA FORMULÁRIO
    formulario = new FormGroup({
      datainicial: new FormControl(''),
      datafinal: new FormControl(''),
  
    });
  
    constructor(
      private parametrosService: ParametrosService,
      private servico: OrdemservicoService,
      private cdr: ChangeDetectorRef,
      private router: Router,  // para passar a rota no metodo 
  
    ) { }
  
    // ///////ATIVA FULL SCREEN////
    // ativarFullscreen(): void {
    //   const elem = document.documentElement;
    //   if (elem.requestFullscreen) {
    //     elem.requestFullscreen();
    //   } else if ((elem as any).webkitRequestFullscreen) { /* Safari */
    //     (elem as any).webkitRequestFullscreen();
    //   } else if ((elem as any).msRequestFullscreen) { /* IE11 */
    //     (elem as any).msRequestFullscreen();
    //   }
    // }
  
    // Função delay para aguardar 100 ms
    delay(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  
    async selecionaRelatorios() {
      if (!this.dataInicio) {
        alert("Data inicial inválida! Digite ou selecione a data e tecle TAB");
        return;
      }
  
      if (!this.dataFim) {
        alert("Data final inválida! Digite ou selecione a data e tecle TAB");
        return;
      }
  
      this. spinnerLoading = true;
  
      // Uso do for...of para permitir o uso de await
      for (const busca of this.relatorios) {
        await this.buscaRelatorios(this.dataInicio, this.dataFim, busca); // Aguarda a execução
        await this.delay(100); // Aguarda 100ms antes da próxima iteração
      }
  
      // Após o loop, chama as funções seguintes
      this.SelecionaRelatoriosStatus();
      this.buscaCalculoComissaoTecnicos();
      this.buscaOsAprovadasOuReprovadasRemotamente()
  
      ////Se existir Alguma OS reprovada ou Aprovada Remotamente, irá ficar piscando o nome do relatório
      //console.log(" Esta é a quantidade de os Aprovadas ou Reprovadas: " , this.arrayAprovadasOuReprovadasRemotamente[0]?.somatoriaDTO.qtOs )
  
      //this. spinnerLoading = false;
  
    }
  
  
    async SelecionaRelatoriosStatus(): Promise<void> {
      this.isLoading = true; // Mostra o spinner
      try {
        for (const status of this.status) {
          await this.buscaRelatoriosStatus(status); // Aguarda a execução
          console.log("Este é o status lido no array de status ", status)
          await this.delay(100); // Aguarda 500ms antes da próxima iteração
        }
      } catch (error) {
        console.error('Erro ao buscar relatórios:', error);
      } finally {
        this.isLoading = false; // Esconde o spinner
      }
    }
  
  
  
    ///SALVA O RESPECTIVO ARRAY NA MEMORIA - FAZ A ROTA - PASSA O NOME DO RELATORIO
    memorizaRelatorio(array: any, variavelEnviada: string, controle: string): void {
      this.servico.setData(array);
      this.variavelEnviada = variavelEnviada;
  
  
      if (controle === "INTERVALO") { // se for atributo com intervalo
        // Navegação programática para a rota com os parâmetros
        this.router.navigate([
          '/os/relatorio/detalhes',
          this.variavelEnviada,
          this.dataInicio,
          this.dataFim
        ]);
      } else { // se for atributo com status
        // Navegação programática para a rota com os parâmetros
        const dataInicioIntermediaria = this.servico.getDataInicio(); //salva a data do input 
        const dataFimIntermediaria = this.servico.getDataFim();
  
        this.dataInicio = "indeterminado",
          this.dataFim = "indeterminado",
          this.router.navigate([
            '/os/relatorio/detalhes',
            this.variavelEnviada,
            this.dataInicio,
            this.dataFim
          ]);
        this.dataInicio = dataInicioIntermediaria; //volta a data que estava no
        this.dataFim = dataFimIntermediaria;
      }
    }
  
  
    buscaRelatoriosStatus(status: string): void {
      this.servico.buscaRelatoriosStatus(status).subscribe(
        (data: any) => {
          switch (status) {
            case "aberta":
              this.arrayStatusaberta = data;
              break;
            case "pronta":
              this.arrayStatusPronta = data;
              break;
            case "passarOrcamento":
              this.arrayStatusPassarOrcamento = data;
              break;
            case "aguardandoAprovacao":
              this.arrayStatusAguardandoAprovacao = data;
              break;
            case "aprovadas":
              this.arrayStatusAprovadas = data;
              console.log(" este é o array de APROVADAS DENTRO DO SWIT CASE", this.arrayStatusAprovadas)
              if (this.arrayStatusAprovadas[0]?.somatoriaDTO.qtOs > 0) {
                this.startBlinkingAprovadas();
              }
              break;
            case "naoAprovadas":
              this.arrayStatusNaoAprovadas = data;
              console.log(" este é o array de não aprovadas", this.arrayStatusNaoAprovadas)
              if (this.arrayStatusNaoAprovadas[0]?.somatoriaDTO.qtOs > 0) {
                this.startBlinkingNaoAprovadas();
              }
              break;
            case "baixadas":
              this.arrayStatusBaixadas = data;
              break;
            case "garantiaLojaAindaNoLaboratorio":
              this.arrayStatusGarantiaLojaAindaNoLaboratorio = data;
              break;
            case "garantiaFabricaAindaNoLaboratorio":
              this.arrayStatusGarantiaFabricaAindaNoLaboratorio = data;
               this. spinnerLoading = false;
              break;
            case "emAnalise":
              this.arrayStatusEmAnalise = data;
              break;
            case "osImpressaMasNaoFechada":
              this.arrayStatusOsImpressaMasNaoFechada = data;
              break;
            default:
              console.warn(`Relatório ${status} não reconhecido.`);
          }
          console.log(`Resultados do relatório ${status}:`, data);
        },
        (error) => {
          if (error.status === 404) {
            console.error(`Nenhum dado encontrado para o relatório ${status}.`);
          } else {
            console.error(`Erro ao buscar relatório ${status}:`, error);
          }
        }
      );
  
    }
    buscaCalculoComissaoTecnicos(): void {
      this.servico.buscaCalculoComissaoTecnicos(this.dataInicio, this.dataFim, "comissaoTecnicos").subscribe(
        (data: any) => {
          // Transforma o objeto em um array
          this.arrayComissaoTecnicos = [data];
        }
      );
    }
  
  
  
    ////////////////////METODOS PARA BUSCAR RELATÓRIOS///////////////////
  
    // Para armazenar os resultados de todos os relatórios
    resultadosRelatorios: { [key: string]: any } = {};
  
    // Modificar buscaRelatorios para armazenar os resultados
    buscaRelatorios(dataInicio: string, dataFim: string, busca: string): void {
      this.servico.buscaRelatoriosEntreDatas(dataInicio, dataFim, busca).subscribe(
        (data: any) => {
          switch (busca) {
            case "faturamentoTotal":
              this.arrayFaturamentoTotal = data;
              console.log(" array faturamento total ", this.arrayFaturamentoTotal)
              const memoFaturamentoTotal = this.servico.getData();
              console.log("memoria faturamento total ", memoFaturamentoTotal)
              break;
            case "faturamentoNobreak":
              this.arrayFaturamentoNobreak = data;
              break;
            case "faturamentoManutencaoNobreak":
              this.arrayFaturamentoManutencaoNobreak = data;
              break;
            case "faturamentoManutencaoNobreakAbaixo3kva":
              this.arrayFaturamentoManutencaoNobreakAbaixo3kva = data;
              break;
            case "faturamentoManutencaoNobreakAcima3kva":
              this.arrayFaturamentoManutencaoNobreakAcima3kva = data;
              break;
            case "vendaNobreakNovo":
              this.arrayVendaNobreakNovo = data;
              break;
            case "vendaNobreakSemiNovo":
              this.arrayVendaNobreakSemiNovo = data;
              break;
            case "nobreakInviavel":
              this.arrayNobreakInviavel = data;
              break;
            case "nobreakOrcamentoNaoAprovado":
              this.arrayNobreakOrcamentoNaoAprovado = data;
              break;
            case "nobreakGarantiaLoja":
              this.arrayNobreakGarantiaLoja = data;
              break;
            case "nobreakGarantiaFabrica":
              this.arrayNobreakGarantiaFabrica = data;
              break;
            case "vendaBateriaAvulsa":
              this.arrayVendaBateriaAvulsa = data;
              break;
            case "vendaSucataBateria":
              this.arrayVendaSucataBateria = data;
              break;
            case "faturamentoMonitor":
              this.arrayFaturamentoMonitor = data;
              break;
            case "faturamentoManutencaoMonitor":
              this.arrayFaturamentoManutencaoMonitor = data;
              break;
            case "vendaMonitorSemiNovo":
              this.arrayVendaMonitorSemiNovo = data;
              break;
            case "monitorInviavel":
              this.arrayMonitorInviavel = data;
              break;
            case "monitorOrcamentoNaoAprovado":
              this.arrayMonitorOrcamentoNaoAprovado = data;
              break;
            case "monitorGarantiaLoja":
              this.arrayMonitorGarantiaLoja = data;
              break;
            case "faturamentoOutroEquipamento":
              this.arrayFaturamentoOutroEquipamento = data;
              break;
            case "entradaEquipamento":
              this.arrayEntradaEquipamento = data;
              break;
            case "orcamentoNoPeriodo":
              this.arrayOrcamentoNoPeriodo = data;
              break;
            case "tecnicoEudermes":
              this.arrayTecnicoEudermes = data;
              break;
            case "tecnicoVinicius":
              this.arrayTecnicoVinicius = data;
              break;
            case "tecnicoLeonardo":
              this.arrayTecnicoLeonardo = data;
              break;
            case "tecnicoRafael":
              this.arrayTecnicoRafael = data;
              break;
            case "tecnicoGabriel":
              this.arrayTecnicoGabriel = data;
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
  
    // Método chamado ao perder o foco do input Data Inicial
    gravaDataInicial(event: KeyboardEvent): void {
      const input = (event.target as HTMLInputElement).value;
  
      if (event.key === 'Tab') { // Dispara a busca ao digitar 4 algarismos
        this.dataInicio = input // Converte o valor para número
        this.servico.setDataInicio(this.dataInicio); //memoriza a data de início
        console.log("esta é a data inicial: " + this.dataInicio)
  
      }
    }
  
    gravaDataFinal(event: KeyboardEvent): void {
      const input = (event.target as HTMLInputElement).value;
  
      if (event.key === 'Tab') { // Dispara a busca ao digitar 4 algarismos
        this.dataFim = input // Converte o valor para número
        this.servico.setDataFim(this.dataFim); //memoriza a data de início
        console.log("esta é a data final: " + this.dataFim)
      }
    }
  
    private isClickEvent: boolean = false;
    limpar() {
  
      console.log(" o botão limpar foi clicado")
      if (!this.isClickEvent) {
        return; // Sai da função se não foi disparada por um clique
      }
  
      this.isClickEvent = false; // Reseta a flag após o clique
      this.router.navigate(['/home']).then(() => {
        this.router.navigate(['os/relatorio']);
      });
    }
  
    onButtonClick() {
      this.isClickEvent = true; // Define a flag quando o botão é clicado
      this.limpar(); // Chama a função
    }
  
  
    ////BUSCA OS APROVADAS E REPROVADAS REMOTAMENTE:
  
    buscaOsAprovadasOuReprovadasRemotamente() {
      this.servico.buscaOsPorStatusRemoto().subscribe({
        next: (data) => {
          this.arrayAprovadasOuReprovadasRemotamente = data;
          console.log('Lista de OS Aprovadas ou Reprovadas Remotamente', this.arrayAprovadasOuReprovadasRemotamente);
          console.log("Esta é a quantidade de os Aprovadas Remotamente ", this.arrayAprovadasOuReprovadasRemotamente[0]?.somatoriaDTO.qtOs)
  
          /////FAZ PISCAR O NOME DO RELATÓRIO
          if (this.arrayAprovadasOuReprovadasRemotamente[0]?.somatoriaDTO.qtOs > 0) {
            this.startBlinking();
            console.log(" Entrou no if das aprovadas remotamente")
          }
  
          if (this.arrayStatusAprovadas[0]?.somatoriaDTO.qtOs > 0) {
            this.startBlinkingAprovadas()
            console.log(" Entrou no if das aprovadas")
          }
  
        },
        error: (err) => {
          console.error('Erro ao buscar ordens de serviço:', err);
        }
      });
    }
  
    //////FAZ O ELEMENTO RELATORIO OS APROVADA OU REPROVADA REMOTAMENTE PISCAR:
  
    
    startBlinking() {
      // Evita múltiplos intervalos ao clicar repetidamente
      if (this.intervalGeral) {
        return;
      }
      this.intervalGeral = setInterval(() => {
        this.currentColor = this.currentColor === 'white' ? 'orange' : 'white';
      }, 1000);
    }
  
    startBlinkingAprovadas() {
      // Evita múltiplos intervalos ao clicar repetidamente
      if (this.intervalAprovadas) {
        return;
      }
      this.intervalAprovadas = setInterval(() => {
        this.currentColorAprovadas = this.currentColorAprovadas === 'white' ? 'green' : 'white';
      }, 1000);
    }
  
    startBlinkingNaoAprovadas() {
      // Evita múltiplos intervalos ao clicar repetidamente
      if (this.intervalNaoAprovadas) {
        return;
      }
      this.intervalNaoAprovadas = setInterval(() => {
        this.currentColorNaoAprovadas = this.currentColorNaoAprovadas === 'white' ? 'red' : 'white';
      }, 1000);
    }
  
    stopBlinking() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.currentColor = 'white'; // Opcional, para resetar a cor
        this.currentColorAprovadas = 'white'; // Opcional, para resetar a cor
        this.currentColorNaoAprovadas = 'white'
      }
    }
  
    ngOnDestroy() {
      this.stopBlinking();
    }
  

}
