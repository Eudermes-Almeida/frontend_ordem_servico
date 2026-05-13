import { FinanceiroService } from './../../../../servico/financeiro.service';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ParametrosCombobox } from '../../../../modelo/ParametrosCombobox';
import { Cliente } from '../../../../modelo/Cliente';
import { Os } from '../../../../modelo/Os';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ParametrosService } from '../../../../servico/parametros.service';
import { OrdemservicoService } from '../../../../servico/ordemservico.service';
import { ReactiveFormsModule } from '@angular/forms'; // 1. Importe o ReactiveFormsModule
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Financeiro } from '../../../../modelo/Financeiro';

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
  dataInicialIntervalo: string = "";
  dataFinalIntervalo: string = "";
  statusFinanceiro: string = "";
  private isClickEvent: boolean = false;
  modeloFinanceiro: Financeiro[] = [];

  ////DATEPICKER:
  model: NgbDateStruct | undefined;
  model2: NgbDateStruct | undefined;

  ///////////CONTROLE DE RENDERIZAÇÃO/////////
  exibirTabela: boolean = false;
  exibirTabela2: boolean = false;
  exibirBotaoSalvar: boolean = false;
  exibirBotaoSair: boolean = false;
  exibirSerial: boolean = false
  spinnerLoading: boolean = false;

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

  constructor(
    private router: Router,
    private parametrosService: ParametrosService,
    private servico: OrdemservicoService,
    private cdr: ChangeDetectorRef,
    private financeiroService: FinanceiroService
  ) { }

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
        this.formulario.patchValue({codcli: retorno.toString()});
        
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

  // //escuta o input num OS SE DIGITAR UM ENTER DEPOIS DO NUM OS
  // onNumOsKey(event: KeyboardEvent): void {
  //   const input = (event.target as HTMLInputElement).value;

  //   if (event.key === 'Enter') { // Dispara a busca ao digitar 4 algarismos
  //     const id = parseInt(input, 10); // Converte o valor para número
  //     this.getOsPorId(id); // Chama o método getCliente com o valor digitado
  //   }
  // }

 

  

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
  // // Escuta o input Ultimas O.S APOS DIGITAR O ENTER
  // onUltimasOsKey(event: KeyboardEvent): void {
  //   const inputElement = event.target as HTMLInputElement;
  //   const input = inputElement.value;

  //   // Verifica se a tecla Enter foi pressionada ou se o input tem 4 caracteres
  //   if (event.key === 'Enter') {
  //     const limite = parseInt(input, 10); // Converte o valor para número
  //     this.buscaUltimasOrdensServico(limite); // Chama o método com o valor digitado
  //   }
  // }


gerenciaAbuscaOsPorIdOuUltimasOs(): void {
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
    console.log ( "Este é o limite de busca de os ", limite)
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

  // Escuta o input Ultimas O.S APOS DIGITAR O ENTER
  onOspeloSerialKey(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const serial = inputElement.value;
    console.log(serial)

    // Verifica se a tecla Enter foi pressionada ou se o input tem 4 caracteres
   
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

  onButtonClick() {
    this.isClickEvent = true; // Define a flag quando o botão é clicado
    this.limpar(); // Chama a função
  }

  // Função para converter o objeto em string
  onDateInicial(event: any): void {
    this.formulario.patchValue({ dataInicio: event });
  }

  onDateFinal(event: any): void {
    this.formulario.patchValue({ dataFim: event });
  }

   onStatusFinanceiro(event: Event): void {
    const elemento = event.target as HTMLSelectElement;
    this.formulario.patchValue({ statusFinanceiro: elemento.value });
  }
}
