import { Despesa } from './../../../../modelo/Despesa';
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
import { Observable } from 'rxjs';

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
  borderoPendentes: Financeiro[] = [];
  osSelecionadasParaRemessa: Financeiro[] = []
  opcaoTipoPagamento: string = "";
  opcaoQuantidadeParcela: string = "";
  opcaoPrazo: string = "";
  prazosDisponiveis: string[] = [];
  borderoJaSalvo: string = "borderô AINDA NÃO salvo"

  ////DATEPICKER:
  model: NgbDateStruct | undefined;
  model2: NgbDateStruct | undefined;
  model3: NgbDateStruct | undefined;

  ///////////CONTROLE DE RENDERIZAÇÃO/////////
  exibirTabelaCliente: boolean = false;
  exibirTabela2: boolean = false;
  exibirBotaoSalvar: boolean = false;
  exibirBotaoSair: boolean = false;
  exibirSerial: boolean = false
  spinnerLoading: boolean = false;
  exibirBtnGerarRemessa: boolean = false
  exibirTabelaRemessa: boolean = false;
  exibeOpcoesParcelamento: boolean = true;
  tabelaBordero: boolean = false;
  exibirFormularioBordero: boolean = false;
  exibirTabelaBordero: boolean = false;
  exibirTabelaGeral: boolean = false;
  exibirFormularioConsulta: boolean = true;

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
    quantidadeBoletos: new FormControl(''),
    valorTotalOs: new FormControl(''),
    valorTotalDespesaBancaria: new FormControl(''),
    valorTotalLiquido: new FormControl(''),
    fantasia: new FormControl(''),
    codCli: new FormControl(''),
    valorCadaBoleto: new FormControl(''),
  });

  // CONFIGURA FORMULÁRIO
  formProcessaBordero = new FormGroup({
    codBordero: new FormControl(''),
    qtOs: new FormControl(''),
    valorTotalOs: new FormControl(''),
    qtClientes: new FormControl(''),
    qtBoletos: new FormControl(''),
    taxaUnicaBordero: new FormControl(''),
    totalDespesasBancarias: new FormControl(''),
    valorLiquidoCreditado: new FormControl(''),
    custoPorBoleto: new FormControl(''),
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
    this.executaVerificacaoDeAtrasos();
  }

  // Buscar clientes por nome fantasia
  buscarClientesPorNomeFantasia(): void {
    const nomefantasia = this.formulario.get('fantasia')?.value;

    if (nomefantasia && nomefantasia.length >= 4) {
      this.servico?.getClientesPorNomeFantasia(nomefantasia).subscribe(
        (dados: Cliente[]) => {
          this.objetocliente = dados; // Armazena os clientes retornados
          this.exibirTabelaCliente = true;
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
        this.exibirTabelaCliente = true;
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
      this.exibirTabelaCliente = false;
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

    this.exibirTabelaGeral = true;

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

    this.exibirTabelaGeral = true;

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

    this.isClickEvent = false; // Reseta a flag após o clique
    this.router.navigate(['/home']).then(() => {
      this.router.navigate(['financeiro/consulta']);
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

    this.exibirTabelaGeral = true;

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

  codCliAceito: number = 0;

  adicionaOsnoArrayDeRemessa(financeiro: Financeiro, event: Event): void {
    // Captura o estado real do checkbox (true/false) a partir do evento de mudança
    const inputCheckbox = event.target as HTMLInputElement;
    const isChecked = inputCheckbox.checked;

    if (this.osSelecionadasParaRemessa.length === 0) {
      this.codCliAceito = financeiro.codcli;
    }

    if (financeiro.codcli !== 0 && financeiro.codcli === this.codCliAceito) {
      if (isChecked) {
        this.osSelecionadasParaRemessa.push(financeiro);
        console.log(`OS ${financeiro.os} ADICIONADA. Total no lote:`, this.osSelecionadasParaRemessa.length);
      } else {
        const index = this.osSelecionadasParaRemessa.findIndex(item => item.os === financeiro.os);
        if (index !== -1) {
          this.osSelecionadasParaRemessa.splice(index, 1);
          console.log(`OS ${financeiro.os} REMOVIDA. Total no lote:`, this.osSelecionadasParaRemessa.length);
        }
      }

      // Atualiza o estado de visibilidade do botão com base no tamanho do lote
      this.exibirBtnGerarRemessa = this.osSelecionadasParaRemessa.length > 0;
      console.log('Lista atual de OS para remessa:', this.osSelecionadasParaRemessa);

    } else {
      // Força o checkbox que acabou de ser clicado a voltar para o estado desmarcado
      inputCheckbox.checked = false;

      alert("Todas as OS de uma remessa, precisam ser de um mesmo cliente ");
      return;
    }
  }

  // NOVA FUNÇÃO AUXILIAR: Mantém a marcação visual em sincronia com o Array
  isOsSelecionada(financeiro: Financeiro): boolean {
    return this.osSelecionadasParaRemessa.some(item => item.os === financeiro.os);
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////GERANDO REMESSAS/////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////


  limparFormularios() {
    this.formProcessaRemessa.patchValue({ dataFaturamento: "" });
    this.formProcessaRemessa.patchValue({ tipoPagamento: "" });
    this.formProcessaRemessa.patchValue({ quantidadeParcelas: "" });
    this.formProcessaRemessa.patchValue({ prazo: "" });
    this.formProcessaRemessa.patchValue({ fantasia: "" });
    this.formProcessaRemessa.patchValue({ codCli: "" });
    this.formProcessaRemessa.patchValue({ quantidadeBoletos: "" });
    this.formProcessaRemessa.patchValue({ valorCadaBoleto: "" });
    this.formProcessaRemessa.patchValue({ valorTotalOs: "" });
    this.formProcessaRemessa.patchValue({ valorTotalDespesaBancaria: "" });
    this.formProcessaRemessa.patchValue({ valorTotalLiquido: "" });
    this.opcaoPrazo = "";
    this.dataFaturamento = "";
    this.opcaoTipoPagamento = "";
    this.opcaoQuantidadeParcela = "";
    this.opcaoQuantidadeParcela = "";

    ////limpar formulário bordero////

    this.formProcessaBordero.patchValue({codBordero: ""});
    this.formProcessaBordero.patchValue({qtOs: ""});
    this.formProcessaBordero.patchValue({valorTotalOs: ""});
    this.formProcessaBordero.patchValue({qtClientes: ""});
    this.formProcessaBordero.patchValue({qtBoletos: ""});
    this.formProcessaBordero.patchValue({valorLiquidoCreditado: ""});
    this.formProcessaBordero.patchValue({totalDespesasBancarias: ""});

    this.borderoJaSalvo = "borderô AINDA NÃO salvo!";

  }


  gerarRemessa() {
    this.exibeOpcoesParcelamento = true;
    this.exibirFormularioConsulta = false;
    this.exibirTabelaGeral = false;
    this.exibirTabelaRemessa = true;
    this.exibirFormularioBordero = false;
    this.exibirTabelaBordero = false;
    this.formProcessaRemessa.patchValue({ taxaDeJuros: "2.98" })
    this.formProcessaRemessa.patchValue({ taxaIof: "0.38" })
    this.formProcessaRemessa.patchValue({ custoPorBoleto: "3.50" })

    this.limparFormularios();

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
    if (this.opcaoTipoPagamento === "DINHEIRO" || this.opcaoTipoPagamento === "PIX" || this.opcaoTipoPagamento === "CARTEIRA") {
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


  processaRemessa() {

    if (!this.dataFaturamento || !this.opcaoTipoPagamento) {
      alert("Você precisa preencher todos os campos do formulário")
      return
    }

    if (this.opcaoTipoPagamento !== "DINHEIRO" && this.opcaoTipoPagamento !== "PIX" && this.opcaoTipoPagamento !== "CARTEIRA") {
      if (!this.opcaoQuantidadeParcela && !this.opcaoPrazo) {
        alert("Você precisa preencher todos os campos do formulário")
        return
      }
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
    this.atualizarDadosDasOrdensSelecionadas('BOLETO');
    this.persisteRemessa();
  }

  pagamentoPorBordero() {
    // Passamos um parâmetro para avisar que o fluxo atual é BORDERO
    this.atualizarDadosDasOrdensSelecionadas('BORDERO');
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

    this.totalOs = 0;
    this.totalDespesasBancarias = 0;
    this.somatoriaTotaliq = 0;

    // Validação de segurança se a lista estiver vazia
    if (!this.osSelecionadasParaRemessa || this.osSelecionadasParaRemessa.length === 0) {
      this.formProcessaRemessa.patchValue({
        fantasia: '',
        codCli: '',
        quantidadeBoletos: '0',
        valorTotalOs: '0.00',
        valorTotalDespesaBancaria: '0.00',
        valorTotalLiquido: '0.00'
      });
      return;
    }

    // 2. APENAS CALCULA: Passa pelos itens acumulando os valores sem alterar nada no array original
    this.osSelecionadasParaRemessa.forEach(item => {
      this.totalOs += Number(item.totaliq || 0);
      this.totalDespesasBancarias += Number(item.custoBancarioTotal || 0);
      this.somatoriaTotaliq += Number(item.valorLiquidoCreditado || 0);
    });

    // 3. ATUALIZA A TELA: Envia os resultados diretamente para os inputs do formulário
    this.formProcessaRemessa.patchValue({
      fantasia: this.osSelecionadasParaRemessa[0].fantasia,
      codCli: this.osSelecionadasParaRemessa[0].codcli ? String(this.osSelecionadasParaRemessa[0].codcli) : '',
      quantidadeBoletos: this.formProcessaRemessa.value.quantidadeParcelas || '0',
      valorTotalOs: this.totalOs.toFixed(2),
      valorTotalDespesaBancaria: '0.00',
      valorTotalLiquido: this.totalOs.toFixed(2),
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
        tipoPagamento: this.formProcessaRemessa.value.tipoPagamento,
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

    this.totalOs = 0;
    this.totalDespesasBancarias = 0;
    this.somatoriaTotaliq = 0;

    // Validação de segurança se a lista estiver vazia
    if (!this.osSelecionadasParaRemessa || this.osSelecionadasParaRemessa.length === 0) {
      this.formProcessaRemessa.patchValue({
        fantasia: '',
        codCli: '',
        quantidadeBoletos: '0',
        valorTotalOs: '0.00',
        valorTotalDespesaBancaria: '0.00',
        valorTotalLiquido: '0.00'
      });
      return;
    }

    // 2. APENAS CALCULA: Passa pelos itens acumulando os valores sem alterar nada no array original
    this.osSelecionadasParaRemessa.forEach(item => {
      this.totalOs += Number(item.totaliq || 0);
      this.totalDespesasBancarias += Number(item.custoBancarioTotal || 0);
      this.somatoriaTotaliq += Number(item.valorLiquidoCreditado || 0);
    });

    // 3. ATUALIZA A TELA: Envia os resultados diretamente para os inputs do formulário
    this.formProcessaRemessa.patchValue({
      fantasia: this.osSelecionadasParaRemessa[0].fantasia,
      codCli: this.osSelecionadasParaRemessa[0].codcli ? String(this.osSelecionadasParaRemessa[0].codcli) : '',
      quantidadeBoletos: this.formProcessaRemessa.value.quantidadeParcelas || '0',
      valorTotalOs: this.totalOs.toFixed(2),
      valorTotalDespesaBancaria: '0.00',
      valorTotalLiquido: this.totalOs.toFixed(2),
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

  // Adicionado o parâmetro tipoFluxo
  atualizarDadosDasOrdensSelecionadas(tipoFluxo: 'BOLETO' | 'BORDERO' = 'BOLETO') {
    const formValues = this.formProcessaRemessa.value;
    const rawDataFat = formValues.dataFaturamento;
    const qtdParcelasStr = formValues.quantidadeParcelas;
    const prazoSelecionado = formValues.prazo || '';
    const tipoPagto = formValues.tipoPagamento || '';

    if (!rawDataFat) {
      console.warn('Data de faturamento não foi selecionada.');
      return;
    }

    let dataFat = '';
    if (typeof rawDataFat === 'object') {
      const dataObjeto = rawDataFat as unknown as NgbDateStruct;
      const ano = dataObjeto.year;
      const mes = String(dataObjeto.month).padStart(2, '0');
      const dia = String(dataObjeto.day).padStart(2, '0');
      dataFat = `${ano}-${mes}-${dia}`;
    } else if (typeof rawDataFat === 'string') {
      dataFat = rawDataFat;
    }

    const qtdParcelas = qtdParcelasStr === 'A VISTA' ? 1 : parseInt(qtdParcelasStr || '1', 10);
    const listaDias = this.obterDiasDoPrazo(prazoSelecionado);

    this.osSelecionadasParaRemessa = this.osSelecionadasParaRemessa.map(item => {
      const totalLiquido = parseFloat(item.totaliq) || 0;
      const valorCadaParcela = (totalLiquido / qtdParcelas).toFixed(2);
      const datasVencimento = this.somarDias(dataFat, listaDias);

      let venc1: string | null = null, val1 = '0.00', status1 = '';
      let venc2: string | null = null, val2 = '0.00', status2 = '';
      let venc3: string | null = null, val3 = '0.00', status3 = '';

      if (qtdParcelas >= 1) { venc1 = datasVencimento[0] || null; val1 = valorCadaParcela; status1 = 'EM DIA'; }
      if (qtdParcelas >= 2) { venc2 = datasVencimento[1] || null; val2 = valorCadaParcela; status2 = 'EM DIA'; }
      if (qtdParcelas === 3) { venc3 = datasVencimento[2] || null; val3 = valorCadaParcela; status3 = 'EM DIA'; }

      return {
        ...item,
        dataFaturamento: dataFat,
        tipoPagamento: tipoPagto,
        qtParcela: qtdParcelasStr || '',
        prazo: prazoSelecionado,
        vencimento1: venc1, valorParcela1: val1, statusParcela1: status1,
        vencimento2: venc2, valorParcela2: val2, statusParcela2: status2,
        vencimento3: venc3, valorParcela3: val3, statusParcela3: status3
      };
    });

    // CORREÇÃO DO DESVIO DE FLUXO:
    if (tipoFluxo === 'BORDERO') {
      this.atualizaTabelaPagamentoPorBordero(dataFat);
    } else {
      this.atualizaTabelaPagamentoPorBoleto();
    }

    this.atualizaTotalizadores();
    this.cdr.markForCheck();
  }

  atualizaTabelaPagamentoPorBoleto() {
    this.osSelecionadasParaRemessa = this.osSelecionadasParaRemessa.map(item => {
      // Captura o valor tratando o risco de vir nulo ou indefinido
      const custoCalculado = (Number(this.formProcessaRemessa.value.custoPorBoleto) * Number(this.formProcessaRemessa.value.quantidadeParcelas)) / this.osSelecionadasParaRemessa.length;
      const custoBoleto = !isNaN(custoCalculado) && isFinite(custoCalculado) ? custoCalculado.toFixed(2) : '0.00';
      return {
        ...item, // Mantém todas as colunas que não foram citadas (como os, fantasia, codcli, etc.)
        dataFaturamento: this.dataFaturamento,
        tipoPagamento: this.formProcessaRemessa.value.tipoPagamento,
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
    this.atualizaTotalizadores()
  }



  executaVerificacaoDeAtrasos() {
    this.spinnerLoading = true;

    this.financeiroService.verificarEAtualizarAtrasos().subscribe({
      next: (retorno: Financeiro[] | string) => {
        this.spinnerLoading = false;

        // Verifica se o retorno é uma mensagem de texto (caso não haja atualizações)
        if (typeof retorno === 'string') {
          alert(retorno);
          return;
        }

        // Se for uma lista válida e contiver registros atualizados
        if (retorno && retorno.length > 0) {
          // alert(`Sucesso: ${retorno.length} parcelas foram identificadas e atualizadas para 'ATRAZADO'.`);
        } else {
          //alert('Nenhum registro precisou de atualização.');
        }
      },
      error: (erro) => {
        this.spinnerLoading = false;
        console.error('Falha ao processar rotina de atrasos:', erro);
        //alert('Erro interno do servidor ao processar a verificação de atrasos. Verifique o terminal do Quarkus.');
      }
    });
  }

  /////VARIÁVEIS USADAS EM ATUALIZA TOTALIZADORES  
  totalOs: number = 0;
  totalDespesasBancarias: number = 0;
  somatoriaTotaliq: number = 0;
  totalPrimeiraParcela: number = 0; // Nova variável acumuladora

  atualizaTotalizadores() {
    this.totalOs = 0;
    this.totalDespesasBancarias = 0;
    this.somatoriaTotaliq = 0;
    this.totalPrimeiraParcela = 0; // Inicia zerada para não duplicar

    if (!this.osSelecionadasParaRemessa || this.osSelecionadasParaRemessa.length === 0) {
      this.formProcessaRemessa.patchValue({
        fantasia: '',
        codCli: '',
        quantidadeBoletos: '0',
        valorTotalOs: '0.00',
        valorTotalDespesaBancaria: '0.00',
        valorTotalLiquido: '0.00',
        valorCadaBoleto: '0.00' // Reseta o novo campo
      });
      return;
    }

    // 1. Soma os valores acumulados. O 'custoBancarioTotal' engloba Tarifa + Juros + IOF
    this.osSelecionadasParaRemessa.forEach(item => {
      this.totalOs += Number(item.totaliq || 0);
      this.totalDespesasBancarias += Number(item.custoBancarioTotal || 0);

      // Nova somatória: converte a string do valor da parcela 1 para número de forma segura
      this.totalPrimeiraParcela += Number(item.valorParcela1 || 0);
    });

    // 2. DEDUÇÃO AUTOMÁTICA: O valor líquido desconta o montante total de despesas calculadas
    const valorLiquidoReal = this.totalOs - this.totalDespesasBancarias;

    // 3. Atualiza os inputs do formulário reativo refletindo os totais na tela
    this.formProcessaRemessa.patchValue({
      fantasia: this.osSelecionadasParaRemessa[0].fantasia,
      codCli: this.osSelecionadasParaRemessa[0].codcli ? String(this.osSelecionadasParaRemessa[0].codcli) : '',
      quantidadeBoletos: this.formProcessaRemessa.value.quantidadeParcelas || '0',
      valorTotalOs: this.totalOs.toFixed(2),
      valorTotalDespesaBancaria: this.totalDespesasBancarias.toFixed(2),
      valorTotalLiquido: valorLiquidoReal.toFixed(2),

      // Injeta o valor somado e formatado no novo input da tela
      valorCadaBoleto: this.totalPrimeiraParcela.toFixed(2)
    });
  }




  calcularJurosTotaisBordero(): number {
    const form = this.formProcessaRemessa.value;

    if (!this.osSelecionadasParaRemessa || this.osSelecionadasParaRemessa.length === 0) return 0;
    if (!form.dataFaturamento || !form.prazo || !form.taxaDeJuros) return 0;

    // Limpa a taxa de juros (converte "2,50" ou "2.5" em número)
    const taxaMensal = Number(String(form.taxaDeJuros).replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
    if (taxaMensal <= 0) return 0;

    const taxaDiaria = (taxaMensal / 100) / 30;

    // Data atual zerada em UTC para bater com as datas do somarDias
    const hoje = new Date();
    const hojeUtc = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

    // CORREÇÃO DA DATA: Extrai a string de faturamento tratando se for objeto ou string
    let dataFatStr = '';
    if (typeof form.dataFaturamento === 'object' && form.dataFaturamento !== null) {
      const dataObjeto = form.dataFaturamento as any;
      const ano = dataObjeto.year;
      const mes = String(dataObjeto.month).padStart(2, '0');
      const dia = String(dataObjeto.day).padStart(2, '0');
      dataFatStr = `${ano}-${mes}-${dia}`;
    } else {
      dataFatStr = String(form.dataFaturamento);
    }

    const arrayDiasDoPrazo = this.obterDiasDoPrazo(form.prazo);
    const quantidadeParcelas = arrayDiasDoPrazo.length;

    let jurosTotalAcumulado = 0;

    this.osSelecionadasParaRemessa.forEach(item => {
      const valorTotalOs = Number(item.totaliq || 0);
      if (valorTotalOs <= 0) return;

      const valorParcela = valorTotalOs / quantidadeParcelas;
      const datasVencimento = this.somarDias(dataFatStr, arrayDiasDoPrazo);

      datasVencimento.forEach(dataVencStr => {
        if (!dataVencStr) return;
        const [ano, mes, dia] = dataVencStr.split('-').map(Number);
        const dataVencUtc = Date.UTC(ano, mes - 1, dia);

        const diferencaMilissegundos = dataVencUtc - hojeUtc;
        const diasAteVencer = Math.ceil(diferencaMilissegundos / (1000 * 60 * 60 * 24));

        if (diasAteVencer > 0) {
          const jurosDaParcela = valorParcela * taxaDiaria * diasAteVencer;
          jurosTotalAcumulado += jurosDaParcela;
        }
      });
    });

    return jurosTotalAcumulado;
  }

  atualizaTabelaPagamentoPorBordero(dataFaturamentoStr: string) {
    const form = this.formProcessaRemessa.value;

    const taxaMensal = Number(String(form.taxaDeJuros || '0').replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
    const taxaIofMensal = Number(String(form.taxaIof || '0').replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
    const tarifaPorBoleto = Number(form.custoPorBoleto) || 0;
    const qtdParcelas = form.quantidadeParcelas === 'A VISTA' ? 1 : parseInt(form.quantidadeParcelas || '1', 10);

    const taxaDiaria = (taxaMensal / 100) / 30;
    const taxaIofDiaria = (taxaIofMensal / 100) / 30;

    const hoje = new Date();
    const hojeUtc = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const arrayDiasDoPrazo = this.obterDiasDoPrazo(form.prazo || '');

    this.osSelecionadasParaRemessa = this.osSelecionadasParaRemessa.map(item => {
      const valorTotalOs = Number(item.totaliq || 0);
      const valorParcela = valorTotalOs / qtdParcelas;
      const datasVencimento = this.somarDias(dataFaturamentoStr, arrayDiasDoPrazo);

      let jurosDaOs = 0;
      let iofDaOs = 0;

      // Calcula os juros e o IOF pro rata desta OS específica
      datasVencimento.forEach(dataVencStr => {
        if (!dataVencStr) return;
        const [ano, mes, dia] = dataVencStr.split('-').map(Number);
        const dataVencUtc = Date.UTC(ano, mes - 1, dia);
        const diasAteVencer = Math.ceil((dataVencUtc - hojeUtc) / (1000 * 60 * 60 * 24));

        if (diasAteVencer > 0) {
          jurosDaOs += valorParcela * taxaDiaria * diasAteVencer;
          iofDaOs += valorParcela * taxaIofDiaria * diasAteVencer;
        }
      });

      const custoTarifaOs = (tarifaPorBoleto * qtdParcelas) / this.osSelecionadasParaRemessa.length;

      // O Custo bancário total agora engloba Juros + Tarifa + IOF
      const despesasTotaisDestaOs = jurosDaOs + custoTarifaOs + iofDaOs;

      return {
        ...item,
        dataFaturamento: dataFaturamentoStr,
        tipoPagamento: form.tipoPagamento || 'BORDERÔ',
        codRemessa: item.codcli + "-" + dataFaturamentoStr,
        valorJaPago: '0.00',
        statusGeral: 'EM DIA',

        jurosBordero: jurosDaOs.toFixed(2),
        iofDiario: iofDaOs.toFixed(2), // Mapeia o IOF individual da OS
        tarifaBordero: custoTarifaOs.toFixed(2),

        custoBancarioTotal: despesasTotaisDestaOs.toFixed(2),
        valorLiquidoCreditado: (valorTotalOs - despesasTotaisDestaOs).toFixed(2)
      };
    });
  }


  calcularIofTotaisBordero(): number {
    const form = this.formProcessaRemessa.value;

    if (!this.osSelecionadasParaRemessa || this.osSelecionadasParaRemessa.length === 0) return 0;
    if (!form.dataFaturamento || !form.prazo || !form.taxaIof) return 0;

    // Limpa a taxa de IOF (converte "0,38" ou "0.38" em número)
    const taxaIofMensal = Number(String(form.taxaIof).replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
    if (taxaIofMensal <= 0) return 0;

    const taxaIofDiaria = (taxaIofMensal / 100) / 30;

    const hoje = new Date();
    const hojeUtc = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

    let dataFatStr = '';
    if (typeof form.dataFaturamento === 'object' && form.dataFaturamento !== null) {
      const dataObjeto = form.dataFaturamento as any;
      dataFatStr = `${dataObjeto.year}-${String(dataObjeto.month).padStart(2, '0')}-${String(dataObjeto.day).padStart(2, '0')}`;
    } else {
      dataFatStr = String(form.dataFaturamento);
    }

    const arrayDiasDoPrazo = this.obterDiasDoPrazo(form.prazo);
    const quantidadeParcelas = arrayDiasDoPrazo.length;

    let iofTotalAcumulado = 0;

    this.osSelecionadasParaRemessa.forEach(item => {
      const valorTotalOs = Number(item.totaliq || 0);
      if (valorTotalOs <= 0) return;

      const valorParcela = valorTotalOs / quantidadeParcelas;
      const datasVencimento = this.somarDias(dataFatStr, arrayDiasDoPrazo);

      datasVencimento.forEach(dataVencStr => {
        if (!dataVencStr) return;
        const [ano, mes, dia] = dataVencStr.split('-').map(Number);
        const dataVencUtc = Date.UTC(ano, mes - 1, dia);

        const diasAteVencer = Math.ceil((dataVencUtc - hojeUtc) / (1000 * 60 * 60 * 24));

        if (diasAteVencer > 0) {
          const iofDaParcela = valorParcela * taxaIofDiaria * diasAteVencer;
          iofTotalAcumulado += iofDaParcela;
        }
      });
    });

    return iofTotalAcumulado;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////GERANDO BORDERO////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////

  buscaPendentesBordero(): void {
    this.exibirFormularioConsulta = false;
    this.exibirTabelaRemessa = false;
    this.exibirFormularioBordero = true;
    this.exibirTabelaBordero = true;
    this.exibirTabelaGeral = false;

    this.limparFormularios();


    this.financeiroService.getPendentesBordero().subscribe(
      (data: Financeiro[]) => {
        // Se o backend retornar 204 No Content, o Angular pode entregar o corpo vazio ou null
        if (!data || data.length === 0) {
          console.log('Nenhum registro pendente de borderô encontrado.');
          this.borderoPendentes = [];
          alert('Nenhum registro financeiro pendente de borderô foi encontrado.');
          this.exibirTabela2 = false; // Oculta a tabela se estiver vazia
          return;
        }

        this.borderoPendentes = data;
        this.populaInicialmenteTotalizadores();
        this.populaTotalizadoresGerarBordero();
      },
      (error) => {
        if (error.status === 204) {
          alert('Nenhum registro financeiro pendente de borderô foi encontrado.');
          //this.modeloFinanceiro = [];
          //this.exibirTabela2 = false;
        } else {
          console.error('Erro ao buscar financeiros pendentes de borderô:', error);
          alert('Erro interno ao carregar os dados de borderô. Tente novamente mais tarde.');
        }
      }
    );

  }

  populaInicialmenteTotalizadores() {
    this.formProcessaBordero.patchValue({ taxaUnicaBordero: "150.00" });
    this.formProcessaBordero.patchValue({ custoPorBoleto: "3.50" });
  }


  populaTotalizadoresGerarBordero() {

    /////código borderô///////////
    const hoje = new Date().toISOString().substring(0, 10);
    this.formProcessaBordero.patchValue({ codBordero: hoje });

    ////INSERE O CÓDIGO DO BORDERO NO ARRAY (BANCO DE DADOS)

    this.borderoPendentes.forEach((os) => {
      {
        os.codBordero = hoje
      }
    })

    ////quantidade os///////////////////
    this.formProcessaBordero.patchValue({ qtOs: String(this.borderoPendentes.length) });

    //// valor total os////////////////////////////
    const valorTotalOs = this.borderoPendentes.reduce((acc, elemento) => {

      const valorElemento = elemento.totaliq ? parseFloat(elemento.totaliq) : 0;
      return acc + valorElemento;
    }, 0);
    this.formProcessaBordero.patchValue({ valorTotalOs: valorTotalOs.toFixed(2) });

    //////quantidade de clientes diferentes
    const clientesUnicos = new Set(this.borderoPendentes
      .map(elemento => elemento.codcli)
      .filter(codcli => codcli !== null && codcli !== undefined));
    const totalClientesDiferentes = clientesUnicos.size;
    this.formProcessaBordero.patchValue({ qtClientes: String(totalClientesDiferentes) });


    /////QUANTIDADE BOLETOS////////////////
    const valorTotaCustoBoleto = this.borderoPendentes.reduce((acc, elemento) => {
      const valorElemento = elemento.tarifaBordero ? parseFloat(elemento.tarifaBordero) : 0;
      return acc + valorElemento;
    }, 0);
    const quantidadeBoletos = valorTotaCustoBoleto / Number(this.formProcessaBordero.value.custoPorBoleto)
    this.formProcessaBordero.patchValue({ qtBoletos: String(quantidadeBoletos) });

    //////// VALOR DA TAXA UNICA BORDERÔ POR BOLETO/////////
    const taxaUnicaBorderoPorOS = Number(this.formProcessaBordero.value.taxaUnicaBordero) / this.borderoPendentes.length;
    this.borderoPendentes.forEach(elemento => {
      elemento.taxaBordero = taxaUnicaBorderoPorOS.toFixed(2);
    });

    //////SOMA JUROS, TAXA BORDERO, IOF E CUSTO BOLETO E COLOCA EM CUSTO BANCARIO TOTAL
    this.borderoPendentes.forEach(elemento => {
      // Converte cada string para número de forma segura (se for nula ou vazia, assume 0)
      const juros = elemento.jurosBordero ? parseFloat(elemento.jurosBordero) : 0;
      const taxa = elemento.taxaBordero ? parseFloat(elemento.taxaBordero) : 0;
      const iof = elemento.iofDiario ? parseFloat(elemento.iofDiario) : 0;
      const tarifa = elemento.tarifaBordero ? parseFloat(elemento.tarifaBordero) : 0;
      const somaCustoTotal = juros + taxa + iof + tarifa;
      elemento.custoBancarioTotal = somaCustoTotal.toFixed(2);

      const valorDespesasTotalBancaria = this.borderoPendentes.reduce((acc, el) => {
        const custo = el.custoBancarioTotal ? parseFloat(el.custoBancarioTotal) : 0;
        return acc + custo
      }, 0)

      this.formProcessaBordero.patchValue({ totalDespesasBancarias: String(valorDespesasTotalBancaria) });
    });

    ////////RECALCULAR VALOR LIQUIDO DE CADA OS
    this.borderoPendentes.forEach((os) => {
      {
        const valorOs = Number(os.totaliq)
        const totalDespesas = Number(os.custoBancarioTotal)
        const totaliqRecalculado = (valorOs - totalDespesas).toFixed(2);
        os.valorLiquidoCreditado = totaliqRecalculado
      }
    })

    /////CALCULANDO VALOR LIQUIDO CREDITADO PARA TOTALIZADOR
    const calculoValorLiquidoCreditado = this.borderoPendentes.reduce((acc, os) => {
      const soma = acc + parseFloat(os.valorLiquidoCreditado)
      return soma
    }, 0)
    this.formProcessaBordero.patchValue({ valorLiquidoCreditado: String(calculoValorLiquidoCreditado.toFixed(2)) });



  }

  processarBordero() {
    ///////PERSISTE OS DADOS:
    this.persisteBordero();
    this.borderoJaSalvo = "";

  }

  persisteBordero() {
    this.financeiroService.atualizarFinanceiroEmLote(this.borderoPendentes).subscribe({
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

  voltar() {
    this.exibirFormularioBordero = false;
    this.exibirTabelaBordero = false;
    this.exibirTabelaRemessa = false;
    this.exibirTabela2 = true;
    this.exibirTabelaGeral = true;
  }


}


