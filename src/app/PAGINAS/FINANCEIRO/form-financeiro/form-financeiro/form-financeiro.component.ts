import { FinanceiroService } from './../../../../servico/financeiro.service';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Cliente } from '../../../../modelo/Cliente';
import { Os } from '../../../../modelo/Os';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ParametrosService } from '../../../../servico/parametros.service';
import { OrdemservicoService } from '../../../../servico/ordemservico.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Financeiro } from '../../../../modelo/Financeiro';

declare var bootstrap: any;

@Component({
  selector: 'app-form-financeiro',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, NgbDatepickerModule, FormsModule],
  templateUrl: './form-financeiro.component.html',
  styleUrl: './form-financeiro.component.css'
})

export class FormFinanceiroComponent {
  @ViewChild('numOsInput') numOsInput!: ElementRef;

  cliente: Cliente = new Cliente();
  os: Os = new Os();
  novocliente: number = 0;
  ultimoCliente: number = 0;
  objetocliente: Cliente[] = [];
  objetoOs: Os[] = [];
  ultimaOs: number = 0;
  novaOs: number = 0;
  dataInicialIntervalo: string = "2010-01-01";
  dataFinalIntervalo: string = "2099-05-30";
  dataFaturamento: string = "";
  statusFinanceiro: string = "";
  private isClickEvent: boolean = false;
  modeloFinanceiro: Financeiro[] = [];
  osSelecionadasParaRemessa: Financeiro[] = []
  opcaoTipoPagamento: string = "";
  opcaoQuantidadeParcela: string = "";
  opcaoPrazo: string = "";
  prazosDisponiveis: string[] = [];

  ////DATEPICKER:
  model: NgbDateStruct | undefined;
  model2: NgbDateStruct | undefined;
  model3: NgbDateStruct | undefined;

  ///////////CONTROLE DE RENDERIZAÇÃO/////////
  exibirTabela: boolean = false;
  exibirTabela2: boolean = false;
  exibirBotaoSalvar: boolean = false;
  exibirBotaoSair: boolean = false;
  exibirSerial: boolean = false
  spinnerLoading: boolean = false;
  exibirBtnGerarRemessa: boolean = false
  exibirTabelaRemessa: boolean = false;
  exibeOpcoesParcelamento: boolean = true;

  // CONFIGURA FORMULÁRIO
  formulario = new FormGroup({
    ultimoCliente: new FormControl(''),
    codcli: new FormControl(''),
    fantasia: new FormControl(''),
    ultimasOs: new FormControl(''),
    ultimaOs: new FormControl(''),
    numOs: new FormControl(''),
    tipoData: new FormControl('entrada'),
    dataInicio: new FormControl(''),
    dataFim: new FormControl(''),
    statusFinanceiro: new FormControl('')
  });

  // CONFIGURA FORMULÁRIO
  formProcessaRemessa = new FormGroup({
    dataFaturamento: new FormControl(''),
    tipoPagamento: new FormControl(''),
    quantidadeParcelas: new FormControl(''),
    prazo: new FormControl(''),
    taxaDeJuros: new FormControl(''),
    taxaIof: new FormControl(''),
    custoPorBoleto: new FormControl('entrada'),
  });

  constructor(
    private router: Router,
    private parametrosService: ParametrosService,
    private servico: OrdemservicoService,
    private cdr: ChangeDetectorRef,
    private financeiroService: FinanceiroService,
    private fb: FormBuilder
  ) { }


  ////METODO PARA HABILITAR TOOL TIP:
  ngAfterViewInit(): void {
    // Captura todos os elementos da tela que possuem o atributo de tooltip
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');

    // Inicializa o comportamento visual do Bootstrap para cada um deles
    Array.from(tooltipTriggerList).map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  // CONFIGURA AS FUNÇÕES QUE SERÃO EXECUTADAS NA INICIALIZAÇÃO DA PÁGINA
  ngOnInit(): void {
    // Escutar mudanças no campo de nomefantasia
    this.formulario.get('fantasia')?.valueChanges.subscribe((value: string) => {
      if (value && value.length >= 4) {
        this.buscarClientesPorNomeFantasia(); // Dispara a busca quando atingir 4 ou mais caracteres
      }
    });
  }

  // Buscar clientes por nome fantasia
  buscarClientesPorNomeFantasia(): void {
    const nomefantasia = this.formulario.get('fantasia')?.value;

    if (nomefantasia && nomefantasia.length >= 4) {
      this.servico?.getClientesPorNomeFantasia(nomefantasia).subscribe(
        (dados: Cliente[]) => {
          this.objetocliente = dados; // Armazena os clientes retornados
          console.log('Clientes encontrados:', this.objetocliente);
          this.exibirTabela = true;
        },
        (erro) => {
          console.error('Erro ao buscar clientes por nome fantasia:', erro);
          alert('Erro ao buscar clientes. Verifique o nome fantasia.');
        }
      );
    } else {
      alert('Por favor, insira um nome fantasia válido.');
    }
  }

  // Busca Clientes por id
  getCliente(id: number): void {
    this.servico.getClientePorId(id).subscribe(
      (data: Cliente) => {
        this.objetocliente = [data]; // Coloca o cliente dentro de um array
        console.log('Cliente obtido:', this.objetocliente);
        this.exibirTabela = true;
      },
      (error) => {
        if (error.status === 404) {
          alert(`Você informou o código ${id}, não existe cliente para este código`);
        } else {
          console.error('Erro ao buscar cliente:', error);
          alert(`Você informou o código ${id}, não existe cliente para este código`);
        }
      }
    );
  }

  //escuta o input id
  onClienteInput(event: KeyboardEvent): void {
    const input = (event.target as HTMLInputElement).value;

    if (event.key === 'Enter') { // Dispara a busca ao digitar 4 algarismos
      const id = parseInt(input, 10); // Converte o valor para número
      this.getCliente(id); // Chama o método getCliente com o valor digitado
    }
  }

  buscaUltimocliente(): void {
    this.servico?.ultimocliente().subscribe({
      next: (retorno: number) => {
        console.log("Este é o ultimo cliente " + retorno);

        // Aplica o valor diretamente no FormGroup
        this.formulario.patchValue({ codcli: retorno.toString() });

        // Executa a busca automaticamente usando o ID encontrado
        this.getCliente(retorno);
      },
      error: (err) => {
        console.error('Erro ao buscar o último cliente:', err);
        alert('Ocorreu um erro durante a busca do código do novo cliente.');
      }
    });
  }

  buscaUltimaOs(): void {
    this.spinnerLoading = true; // Liga o indicador de processamento

    this.financeiroService.ultimaOs().subscribe({
      next: (retorno: number) => {
        this.spinnerLoading = false;

        // Valida se o banco não retornou vazio (NULL)
        if (retorno === null || retorno === undefined) {
          alert('Nenhum registro financeiro encontrado no banco de dados.');
          return;
        }

        console.log("Esta é a última OS em financeiro:", retorno);

        // Atualiza o input "numOs" do FormGroup com o ID encontrado
        this.formulario.patchValue({
          numOs: retorno.toString()
        });

      },
      error: (error) => {
        this.spinnerLoading = false; // Desliga o spinner em caso de falha
        console.error('Erro ao buscar última OS:', error);

        if (error.status === 404) {
          alert('Nenhuma ordem de serviço localizada na tabela financeira.');
        } else {
          alert('Erro interno ao buscar a última O.S. Verifique a conexão com o servidor.');
        }
      }
    });
  }


  escreveDadosClienteNosInputs(cliente: Cliente): void {
    console.log('Dados do cliente:', cliente);
    this.formulario.patchValue({
      codcli: cliente.id,
      fantasia: cliente.nomefantasia,
    });

    setTimeout(() => {  // aguarda 1 segundo para fechar a tabela
      this.exibirTabela = false;
      this.cdr.detectChanges(); // Força a atualização da visualização imediatamente
    }, 1000);
  }

  //////////////////////////////////////////METODOS PARA BUSCAR OS //////////////////////////////////

  // Escuta o input Cod Cliente APOS DIGITAR O ENTER
  onCodCliKey(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const input = inputElement.value;

    // Verifica se a tecla Enter foi pressionada ou se o input tem 4 caracteres
    if (event.key === 'Enter' || input.length === 4) {
      const codcli = parseInt(input, 10); // Converte o valor para número
      this.getOsPorCodCli(codcli); // Chama o método com o valor digitado
    }
  }

  //escuta o input COD CLIENTE APOS DIGITAR 4 CARACTERES
  onCodCliInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;

    if (input.length === 4) { // Dispara a busca ao digitar 4 algarismos
      const codcli = parseInt(input, 10); // Converte o valor para número
      this.getOsPorCodCli(codcli); // Chama o método com o valor digitado
    }
  }

  // Busca ORDENS DE SERVIÇO PELO CODIGO DO CLIENTE
  getOsPorCodCli(codcli: number): void {
    this.modeloFinanceiro = [];
    this.spinnerLoading = true;

    this.financeiroService.getOsPorCodCli(codcli).subscribe(
      (data: Financeiro[]) => { // 1. CORRIGIDO: Adicionado os colchetes [] para indicar que é um Array
        this.modeloFinanceiro = data; // Armazena a lista de registros retornada

        // 2. CORRIGIDO: Exibe no console a variável correta que acabou de receber os dados
        console.log('Ordens financeiras obtidas:', this.modeloFinanceiro);
        this.exibirTabela2 = true;
        this.spinnerLoading = false;
      },
      (error) => {
        this.spinnerLoading = false; // 3. CORRIGIDO: Desliga o spinner em caso de falha na requisição

        if (error.status === 404) {
          alert(`Não há ordens de serviço cadastradas com este código: ${codcli}.`);
        } else {
          console.error('Erro ao buscar ordens financeiras:', error);
          alert(`Erro ao buscar ordens com este código: ${codcli}.`);
        }
      }
    );
  }

  // Escuta o input Cod Cliente
  onDataEntradaInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const input = inputElement.value;
    console.log(input);

    // Verifica se o input tem 8 caracteres
    if (input.length === 8) {
      console.log("entrou no if");
      this.getOsPorDataEntrada(input); // Chama o método com o valor digitado
    }
  }

  // Busca ORDENS DE SERVIÇO PELA DATA DE ENTRADA
  getOsPorDataEntrada(dataEntrada: string): void {
    this.servico.getOsPorDadaEntrada(dataEntrada).subscribe(
      (data: Os[]) => { // Espera um array de os
        this.objetoOs = data; // Armazena todos os clientes retornados
        console.log('Os obtidas por data de entrada:', this.objetoOs);
        this.exibirTabela2 = true;
      },
      (error) => {
        if (error.status === 404) {
          alert(`Não há ordem de serviços registrados nesta data: ${dataEntrada}.`);
        } else {
          console.error('Erro ao buscar clientes por cidade:', error);
          alert(`Erro ao buscar ordem de serviço para esta data ${dataEntrada}.`);
        }
      }
    );
  }

  gerenciaAbuscaOsPorIdOuUltimasOs(): void {
    this.modeloFinanceiro = [];
    const numOsValue = this.formulario.get('numOs')?.value;
    const ultimasOsValue = this.formulario.get('ultimasOs')?.value;

    // Se o campo numOs estiver preenchido, busca por ID único
    if (numOsValue) {
      const idConvertido = Number(numOsValue); // CONVERSÃO CORRETA
      this.getOsPorId(idConvertido);
    }
    // Caso contrário, se o limite estiver preenchido, busca em lote pelas últimas OS
    else if (ultimasOsValue) {
      const limiteConvertido = Number(ultimasOsValue); // CONVERSÃO CORRETA
      this.buscaUltimasOrdensServico(limiteConvertido);
    }
    // Se nenhum dos dois campos estiver preenchido
    else {
      alert('Por favor, informe o Nº O.S. ou a quantidade de Últimas O.S. para realizar a busca.');
    }
  }

  // Busca ORDEM SERVIÇO por id
  getOsPorId(id: number): void {
    console.log(" Este é o id da os ", id)
    this.financeiroService.getOsPorId(id).subscribe(
      (data: Financeiro) => {
        this.modeloFinanceiro = [data]; // Coloca o cliente dentro de um array
        console.log('O.S. obtida:', this.modeloFinanceiro);
        this.exibirTabela2 = true;
      },
      (error) => {
        if (error.status === 404) {
          alert(`Você informou o código ${id}, não existe ordem de serviço para este código`);
        } else {
          console.error('Erro ao buscar cliente:', error);
          alert(`Você informou o código ${id}, não existe ordem de serviço para este código`);
        }
      }
    );
  }


  // Busca ORDENS DE SERVIÇO PELA DATA DE ENTRADA
  buscaUltimasOrdensServico(limite: number): void {
    console.log("Este é o limite de busca de os ", limite)
    this.financeiroService.getUltimasOrdensServicos(limite).subscribe(
      (data: Financeiro[]) => { // Espera um array de os
        this.modeloFinanceiro = data; // Armazena todos os clientes retornados
        console.log('Ultimas os delimitadas:', this.modeloFinanceiro);
        this.exibirTabela2 = true;
      },
      (error) => {
        if (error.status === 404) {
          alert(`Não há ordem de serviços para este limite selecionado:  ${limite}.`);
        } else {
          console.error('Erro ao buscar clientes por cidade:', error);
          alert(`Não há ordem de serviços para este limite selecionado:  ${limite}.`);
        }
      }
    );
  }

  limpar() {
    if (!this.isClickEvent) {
      return; // Sai da função se não foi disparada por um clique
    }

    this.isClickEvent = false; // Reseta a flag após o clique
    this.router.navigate(['/home']).then(() => {
      this.router.navigate(['financeiro']);
    });
  }

  ////tratando clicks dos radios
  onButtonClick() {
    this.isClickEvent = true; // Define a flag quando o botão é clicado
    this.limpar(); // Chama a função
  }

  onStatusFinanceiro(event: Event): void {
    const elemento = event.target as HTMLSelectElement;
    this.formulario.patchValue({ statusFinanceiro: elemento.value });
  }

  // tratando clicks dos radios
  onRadioChange(): void {
    const valorAtual = this.formulario.get('tipoData')?.value;
    console.log('Rádio clicado! Novo valor detectado no formulário:', valorAtual);
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

  onBuscarFiltros(): void {

    this.modeloFinanceiro = [];
    // 1. Captura o status e o tipo de data direto do FormGroup
    const statusSelecionado = this.formulario.get('statusFinanceiro')?.value || 'TODOS';
    const tipoDataSelecionado = this.formulario.get('tipoData')?.value || 'entrada';

    // 2. Validação: Garante que as variáveis globais de data foram preenchidas pelo datepicker
    if (!this.dataInicialIntervalo || !this.dataFinalIntervalo) {
      alert('Por favor, selecione o período de Início e Fim para realizar a busca.');
      return;
    }

    this.spinnerLoading = true; // Ativa o indicador de processamento

    // 3. Dispara a requisição passando as variáveis globais que você já possui formatadas
    this.financeiroService.getRegistrosFiltrados(
      this.dataInicialIntervalo,
      this.dataFinalIntervalo,
      statusSelecionado,
      tipoDataSelecionado
    ).subscribe({
      next: (dados: Financeiro[]) => {
        this.modeloFinanceiro = dados; // Alimenta a sua tabela com os registros retornados
        this.exibirTabela2 = true;
        this.spinnerLoading = false;
        console.log('Filtro dinâmico carregado com sucesso:', this.modeloFinanceiro);
      },
      error: (erro) => {
        this.spinnerLoading = false; // Desliga o spinner em caso de falha
        console.error('Erro na busca avançada:', erro);

        if (erro.status === 404) {
          alert('Nenhum registro financeiro localizado para os critérios informados.');
        } else {
          alert('Erro interno ao processar a busca no servidor.');
        }
      }
    });
  }

  adicionaOsnoArrayDeRemessa(financeiro: Financeiro, isChecked: boolean): void {
    if (isChecked) {
      // Insere o objeto diretamente, pois as tipagens agora são compatíveis
      this.osSelecionadasParaRemessa.push(financeiro);
      console.log(`OS ${financeiro.os} ADICIONADA. Total no lote:`, this.osSelecionadasParaRemessa.length);
    } else {
      // CORRIGIDO: Comparação direta usando number (sem necessidade de .toString())
      const index = this.osSelecionadasParaRemessa.findIndex(item => item.os === financeiro.os);

      if (index !== -1) {
        this.osSelecionadasParaRemessa.splice(index, 1);
        console.log(`OS ${financeiro.os} REMOVIDA. Total no lote:`, this.osSelecionadasParaRemessa.length);
      }
    }

    // Atualiza o estado de visibilidade do botão com base no tamanho do lote
    this.exibirBtnGerarRemessa = this.osSelecionadasParaRemessa.length > 0;

    console.log('Lista atual de OS para remessa:', this.osSelecionadasParaRemessa);
  }

  gerarRemessa() {
    this.exibirTabelaRemessa = true;
    this.formProcessaRemessa.patchValue({ taxaDeJuros: "2.98" })
    this.formProcessaRemessa.patchValue({ taxaIof: "0.38" })
    this.formProcessaRemessa.patchValue({ custoPorBoleto: "3.50" })
  }

  // Função para converter o objeto em string
  onDateFaturamento(date: NgbDateStruct) {
    // Formato Brasileiro: DD/MM/AAAA
    const dia = date.day.toString().padStart(2, '0');
    const mes = date.month.toString().padStart(2, '0');
    const ano = date.year;
    console.log(" Este é dia ", dia)
    this.dataFaturamento = `${ano}-${mes}-${dia}`;
    console.log('Data salva como string:', this.dataFaturamento);
  }

  onTipoPagamento(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.opcaoTipoPagamento = target.value;
    if(this.opcaoTipoPagamento === "DINHEIRO"  || this.opcaoTipoPagamento === "PIX" || this.opcaoTipoPagamento === "CARTEIRA"){
      this.exibeOpcoesParcelamento = false;
      //this.processaRemessa();
    }
  }

  onQuantidadeParcelas(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  const valorSelecionado = selectElement.value;

  // Reseta o campo prazo usando a estrutura que você já declarou
  this.formProcessaRemessa.get('prazo')?.setValue('');

  // Atualiza a lista de prazos com base no mapa (declarado na classe)
  this.prazosDisponiveis = this.mapaPrazos[valorSelecionado] || [];
}


processaRemessa(){

  if(!this.dataFaturamento){
    alert("Você precisa escolher a data do faturamento!")
    return
  }

    switch (this.opcaoTipoPagamento) {
      case "DINHEIRO":
        this.pagamentoAvista();
        break;

      case "PIX":
        this.pagamentoAvista();
        break;

      case "BOLETO":
        this.pagamentoPorBoleto();
        break;

      case "BORDERO":
        this.pagamentoPorBordero();
        break;

      case "CARTEIRA":
        this.carteira();
        break;

      default:
        console.warn("Tipo de pagamento inválido")
        break;

    }
  }

  pagamentoPorBoleto() {
    console.log("Forma de pagamento Escolhido: Boleto")
    this.atualizarDadosDasOrdensSelecionadas();
    this.persisteRemessa()
  }

  pagamentoPorBordero() {
    console.log("Forma de pagamento Escolhido: Borderô")
    this.persisteRemessa();
     
  }

  carteira() {
    console.log("Forma de pagamento Escolhido: Carteira")
    this.exibeOpcoesParcelamento = false;
    // Percorre todo o array atualizando os campos solicitados com os novos valores à vista
    this.osSelecionadasParaRemessa = this.osSelecionadasParaRemessa.map(item => {
      return {
        ...item, // Mantém todas as colunas que não foram citadas (como os, fantasia, codcli, etc.)
        tipoPagamento: 'CARTEIRA',
        statusGeral: 'CARTEIRA',
        
      };
    });
    this.persisteRemessa();
  }

  pagamentoAvista(): void {
    this.exibeOpcoesParcelamento = false;
    // Percorre todo o array atualizando os campos solicitados com os novos valores à vista
    this.osSelecionadasParaRemessa = this.osSelecionadasParaRemessa.map(item => {
      return {
        ...item, // Mantém todas as colunas que não foram citadas (como os, fantasia, codcli, etc.)
        dataFaturamento: this.dataFaturamento,
        tipoPagamento: 'A VISTA',
        //codRemessa: item.codcli +"-" + this.dataFaturamento,
        valorJaPago: item.totaliq, // Copia o valor atual do total líquido
        statusGeral: 'PAGO',
        jurosBordero: '0.00',
        iofDiario: '0.00',
        tarifaBordero: '0.00',
        custoBancarioTotal: '0.00', // Mapeia custoBancario para a propriedade correta da interface
        valorLiquidoCreditado: item.totaliq  // Copia o valor atual do total líquido para o líquido final
      };
    });
    this.persisteRemessa();
  }

  persisteRemessa() {
    this.financeiroService.atualizarFinanceiroEmLote(this.osSelecionadasParaRemessa).subscribe({
      next: (retornoDoBanco: Financeiro[]) => {
        this.spinnerLoading = false;
        if (!retornoDoBanco || retornoDoBanco.length === 0) {
          alert('Ocorreu um problema: os registros não puderam ser gravados no banco.');
          return;
        }
        alert(`${retornoDoBanco.length} A remessa foi salva com sucesso`);
      },
      error: (erro) => {
        this.spinnerLoading = false;
        console.error('Falha catastrófica ao liquidar lote financeiro:', erro);
        alert('Erro interno do servidor ao processar o pagamento em lote. Verifique o terminal do Quarkus.');
      }
    });

  }

  private mapaPrazos: { [key: string]: string[] } = {
    'A VISTA': ['A VISTA'],
    '1': ['A VISTA', '3 DIAS', '7 DIAS', '15 DIAS', '30 DIAS'],
    '2': ['15/30 DIAS', '30/60 DIAS'],
    '3': ['15/30/45 DIAS', '30/60/90 DIAS']
  };

onPrazo(event: Event): void {
  const target = event.target as HTMLSelectElement;
  this.opcaoPrazo = target.value;
}

obterDiasDoPrazo(prazo: string): number[] {
  if (!prazo || prazo === 'A VISTA') return [0];
  
  // Limpa o texto "DIAS" e separa por barra "/"
  const apenasNumeros = prazo.replace(/DIAS/gi, '').trim();
  return apenasNumeros.split('/').map(num => parseInt(num.trim(), 10) || 0);
}

// Mantido recebendo number[] e retornando string[] (Array de datas YYYY-MM-DD)
somarDias(dataStr: string, dias: number[]): string[] {
  if (!dataStr || !dias || dias.length === 0) return [];

  return dias.map(qtdDias => {
    // Cria a data interpretando estritamente em UTC para evitar distorções locais
    const [ano, mes, dia] = dataStr.split('-').map(Number);
    const data = new Date(Date.UTC(ano, mes - 1, dia)); 

    // Soma os dias diretamente no tempo UTC
    data.setUTCDate(data.getUTCDate() + qtdDias);
    
    // Retorna formatado perfeitamente como YYYY-MM-DD
    return data.toISOString().split('T')[0]; 
  });
}

atualizarDadosDasOrdensSelecionadas() {
  const formValues = this.formProcessaRemessa.value;
  const rawDataFat = formValues.dataFaturamento; 
  const qtdParcelasStr = formValues.quantidadeParcelas;
  const prazoSelecionado = formValues.prazo || '';
  const tipoPagto = formValues.tipoPagamento || '';

  // 1. Validação defensiva: se a data não estiver preenchida, interrompe o cálculo
  if (!rawDataFat) {
    console.warn('Data de faturamento não foi selecionada.');
    return; 
  }

  // 2. Agora o TypeScript sabe com 100% de certeza que 'rawDataFat' NÃO é null ou undefined
  let dataFat = '';
  if (typeof rawDataFat === 'object') {
    // USANDO A INTERFACE NATIVA DO NG-BOOTSTRAP CORRETAMENTE
    const dataObjeto = rawDataFat as unknown as NgbDateStruct;
    
    const ano = dataObjeto.year;
    const mes = String(dataObjeto.month).padStart(2, '0');
    const dia = String(dataObjeto.day).padStart(2, '0');
    
    dataFat = `${ano}-${mes}-${dia}`;
  } else if (typeof rawDataFat === 'string') {
    dataFat = rawDataFat;
  }

  const qtdParcelas = qtdParcelasStr === 'A VISTA' ? 1 : parseInt(qtdParcelasStr || '1', 10);

  // 2. Obtém o array de dias extras (Ex: [30, 60])
  const listaDias = this.obterDiasDoPrazo(prazoSelecionado);

  // 3. Percorre o array original alterando os dados
  this.osSelecionadasParaRemessa = this.osSelecionadasParaRemessa.map(item => {
    const totalLiquido = parseFloat(item.totaliq) || 0;
    const valorCadaParcela = (totalLiquido / qtdParcelas).toFixed(2);

    // Agora 'dataFat' está garantida como String válida ("2026-05-01")
    const datasVencimento = this.somarDias(dataFat, listaDias);

    // Inicializa os campos como null em vez de string vazia
    let venc1: string | null = null, val1 = '0.00', status1 = '';
    let venc2: string | null = null, val2 = '0.00', status2 = '';
    let venc3: string | null = null, val3 = '0.00', status3 = '';

    // Extrai as posições correspondentes do array de datas gerado
    if (qtdParcelas >= 1) {
      venc1 = datasVencimento[0] || null;
      val1 = valorCadaParcela;
      status1 = 'EM DIA';
    }
    if (qtdParcelas >= 2) {
      venc2 = datasVencimento[1] || null;
      val2 = valorCadaParcela;
      status2 = 'EM DIA';
    }
    if (qtdParcelas === 3) {
      venc3 = datasVencimento[2] || null;
      val3 = valorCadaParcela;
      status3 = 'EM DIA';
    }

    return {
      ...item,
      dataFaturamento: dataFat, // Salva a data já formatada como string na OS
      tipoPagamento: tipoPagto,
      qtParcela: qtdParcelasStr || '',
      prazo: prazoSelecionado,
      
      vencimento1: venc1,
      valorParcela1: val1,
      statusParcela1: status1,

      vencimento2: venc2, // Enviará null para o Quarkus se não houver 2ª parcela
      valorParcela2: val2,
      statusParcela2: status2,

      vencimento3: venc3, // Enviará null para o Quarkus se não houver 3ª parcela
      valorParcela3: val3,
      statusParcela3: status3
    };
  });

  this.atualizaTabelaPagamentoPorBoleto();
  // Força a atualização visual caso use detecção OnPush
  this.cdr.markForCheck();
}

atualizaTabelaPagamentoPorBoleto() {
  this.osSelecionadasParaRemessa = this.osSelecionadasParaRemessa.map(item => {
    // Captura o valor tratando o risco de vir nulo ou indefinido
    const custoBoleto = this.formProcessaRemessa.value.custoPorBoleto || '0.00';

    return {
      ...item, // Mantém todas as colunas que não foram citadas (como os, fantasia, codcli, etc.)
      dataFaturamento: this.dataFaturamento,
      tipoPagamento: 'BOLETO',
      codRemessa: item.codcli + "-" + this.dataFaturamento,
      valorJaPago: '0.00',
      tarifa: custoBoleto,
      statusGeral: 'EM DIA',
      jurosBordero: '0.00',
      iofDiario: '0.00',
      tarifaBordero: custoBoleto,
      custoBancarioTotal: custoBoleto, // Mapeia custoBancario para a propriedade correta da interface
      valorLiquidoCreditado: (Number(item.totaliq) - Number(custoBoleto)).toFixed(2) 
    };
  });
}
}


