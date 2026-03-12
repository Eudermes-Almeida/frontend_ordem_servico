import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ParametrosCombobox } from '../../../modelo/ParametrosCombobox';
import { Cliente } from '../../../modelo/Cliente';
import { Os } from '../../../modelo/Os';
import { FormControl, FormGroup } from '@angular/forms';
import { ParametrosService } from '../../../servico/parametros.service';
import { OrdemservicoService } from '../../../servico/ordemservico.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-form-deletar-os',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-deletar-os.component.html',
  styleUrl: './form-deletar-os.component.css'
})
export class FORMDELETAROSComponent {

  @ViewChild('numOsInput') numOsInput!: ElementRef;
  cidades: ParametrosCombobox[] = [];
  cidadeSelecionada: string = "";
  cidadesPosicaoZero: any = { id: 100, parametro: 'SEGMENTO', valor: 'CIDADES' }; // para não iniciar com um nome de cidade e sim "cidades"

  cliente: Cliente = new Cliente();
  os: Os = new Os();
  novocliente: number = 0;
  ultimoCliente: number = 0;
  objetocliente: Cliente[] = [];
  objetoOs: Os[] = [];
  ultimaOs: number = 0;
  novaOs: number = 0;

  ///////////CONTROLE DE RENDERIZAÇÃO/////////
  exibirTabela: boolean = false;
  exibirTabela2: boolean = false;
  exibirBotaoSalvar: boolean = false;
  exibirBotaoSair: boolean = false;
  exibirSerial: boolean = false
  exibirAlertSucessoDeletarOs: boolean = false;
  exibirErroDeletarOs: boolean = false;
  exibirNaoExisteMaisBancoDados: boolean = false;

  

  // CONFIGURA FORMULÁRIO
  formulario = new FormGroup({
    os:new FormControl(''),
    data:new FormControl(''),
    hora:new FormControl(''),
    fantasia:new FormControl(''),
    rzsocial:new FormControl(''),
    codcli:new FormControl(''),
    atendente:new FormControl(''),
    status:new FormControl(''),
    prioridade:new FormControl(''),
    equipamento:new FormControl(''),
    marca:new FormControl(''),
    modelo:new FormControl(''),
    topologia:new FormControl(''),
    cor: new FormControl(''),
    serial:new FormControl(''),
    patrimonio:new FormControl(''),
    obs1:new FormControl(''),
    obs2:new FormControl(''),
    defeito1:new FormControl(''),
    defeito2:new FormControl(''),
    defeito3:new FormControl(''),
    tarefa1:new FormControl(''),
    tarefa2:new FormControl(''),
    tarefa3:new FormControl(''),
    baterias:new FormControl(''),
    material2:new FormControl(''), 
    material3:new FormControl(''),
    outrositens:new FormControl(''),
    qt1:new FormControl(''), 
    qt2:new FormControl(''),
    qt3:new FormControl(''),
    qtoutrositens:new FormControl(''),
    qtdeslocamento:new FormControl(''), 
    valorunit1:new FormControl(''), 
    valorunit2:new FormControl(''),
    valorunit3:new FormControl(''), 
    valorunitoutrositens:new FormControl(''),
    valorunitariodeslocamento:new FormControl(''),
    valortotal1:new FormControl(''), 
    valortotal2:new FormControl(''),
    valortotal3:new FormControl(''), 
    valortotaloutrositens:new FormControl(''),
    valortotaldeslocamento:new FormControl(''),
    valorassistencia:new FormControl(''),
    totalbruto:new FormControl(''),
    valordesconto:new FormControl(''),
    desconto:new FormControl(''),
    totaliq:new FormControl(''),
    fechamento:new FormControl(''),
    tecnico:new FormControl(''),
    garantia:new FormControl(''),
    dataorca:new FormControl(''),
    osoriginal:new FormControl(''),
    venda:new FormControl(''),
    modelofake:new FormControl(''),
    obs3:new FormControl(''),
    jaimp:new FormControl(''),
    top10:new FormControl(''),
    dataretro:new FormControl(''),
     });

     constructor(
      private parametrosService: ParametrosService, 
      private servico: OrdemservicoService,
      private cdr: ChangeDetectorRef
  ) {}


  ////////////////ESCUTA OS SELECT'S /////////////////////////////////////////////////

// ESCUTA O SELECT CIDADES - QUANDO ELE É ACIONADO, COLOCA O VALOR DELE EM "CIDADE SELECIONADA"
 onCityChange(event: Event): void {
  this.cidadeSelecionada = (event.target as HTMLSelectElement).value; // Atualiza a cidade selecionada
  this.getClientePorCidade(this.cidadeSelecionada);  // Chama o método para buscar clientes pela cidade 
}

  // CONFIGURA AS FUNÇÕES QUE SERÃO EXECUTADAS NA INICIALIZAÇÃO DA PÁGINA
  ngOnInit(): void {
      this.buscarCidades();



    // Escutar mudanças no campo de nomefantasia
    this.formulario.get('fantasia')?.valueChanges.subscribe((value: string) => {
      if (value && value.length >= 4) {
        this.buscarClientesPorNomeFantasia(); // Dispara a busca quando atingir 4 ou mais caracteres
      }
    });

    // Escutar mudanças no campo de razaosocial
    this.formulario.get('rzsocial')?.valueChanges.subscribe((value: string) => {
      if (value && value.length >= 4) {
        this.buscarClientesPorRazaoSocial(); // Dispara a busca quando atingir 4 ou mais caracteres
      }
    });
  }

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

  // Buscar clientes por Razao Social
  buscarClientesPorRazaoSocial(): void {
    const razaoSocial = this.formulario.get('rzsocial')?.value;

    if (razaoSocial && razaoSocial.length >= 4) {
      this.servico?.getClientesPorRazaoSoocial(razaoSocial).subscribe(
        (dados: Cliente[]) => {
          this.objetocliente = dados; // Armazena os clientes retornados
          console.log('Clientes encontrados:', this.objetocliente);
          this.exibirTabela = true;
        },
        (erro) => {
          console.error('Erro ao buscar clientes por Razao Social:', erro);
          alert('Erro ao buscar clientes. Verifique o nome Razao Social.');
        }
      );
    } else {
      alert('Por favor, insira uma Razao Social válida.');
    }
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

  // busca as cidades no parametro para popular o select
  buscarCidades(): void {
    this.parametrosService?.getCidades().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.cidades = dados;
        this.cidades.unshift(this.cidadesPosicaoZero);
        console.log(this.cidades);
      },
      (erro) => {
        console.error('Erro ao buscar cidades:', erro);
      }
    );
  }

  // Busca Clientes por cidade
  getClientePorCidade(cidade: string): void {
    this.servico.getClientesPorCidade(cidade).subscribe(
      (data: Cliente[]) => { // Espera um array de clientes
        this.objetocliente = data; // Armazena todos os clientes retornados
        console.log('Clientes obtidos:', this.objetocliente);
        this.exibirTabela = true;
      },
      (error) => {
        if (error.status === 404) {
          alert(`Não há clientes cadastrados na cidade ${cidade}.`);
        } else {
          console.error('Erro ao buscar clientes por cidade:', error);
          alert(`Erro ao buscar clientes na cidade ${cidade}.`);
        }
      }
    );
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

  buscaUltimocliente(codigoClienteInput: HTMLInputElement): void {
    this.servico?.ultimocliente().subscribe({
      next: (retorno: number) => {
        this.ultimoCliente = retorno;
        this.exibirTabela = true;
        console.log("Este é o ultimo cliente " + this.ultimoCliente);
        
        // Atualiza o valor do input com o último cliente
        codigoClienteInput.value = this.ultimoCliente.toString();
        
        // Opcional: dispara o evento de input manualmente para a busca automática
        const event = new Event('input', {
          bubbles: true,
          cancelable: true
        });
        codigoClienteInput.dispatchEvent(event);
      },
      error: (err) => {
        console.error('Erro ao buscar o último cliente:', err);
        alert('Ocorreu um erro durante a busca do código do novo cliente. O Novo cliente NÃO foi cadastrado');
      }
    });
  }

  buscaUltimaOs(): void {
    this.servico?.ultimaOs().subscribe({
      next: (retorno: number) => {
        this.ultimaOs = retorno;
        console.log("Esta é a última OS " + this.ultimaOs);

        // Atualiza o valor do input com o último cliente
        this.numOsInput.nativeElement.value = this.ultimaOs.toString();
        
        // Dispara o evento de input manualmente
        const event = new Event('input', {
          bubbles: true,
          cancelable: true
        });
        this.numOsInput.nativeElement.dispatchEvent(event);
      },
      error: (error) => {
        console.error('Erro ao buscar última OS:', error);
      }
    });
}


  escreveDadosClienteNosInputs(cliente: Cliente): void {
    console.log('Dados do cliente:', cliente);
        this.formulario.patchValue({
            codcli: cliente.id, 
            fantasia: cliente.nomefantasia,
            rzsocial: cliente.razaosocial,
        });

    setTimeout(() => {  // aguarda 1 segundo para fechar a tabela
      this.exibirTabela = false;
      this.cdr.detectChanges(); // Força a atualização da visualização imediatamente
    }, 1000);

  } 

//////////////////////////////////////////METODOS PARA BUSCAR OS //////////////////////////////////

//escuta o input num OS SE DIGITAR UM ENTER DEPOIS DO NUM OS
onNumOsKey(event: KeyboardEvent): void {
  const input = (event.target as HTMLInputElement).value;

  if (event.key === 'Enter') { // Dispara a busca ao digitar 4 algarismos
    const id = parseInt(input, 10); // Converte o valor para número
    this.getOsPorId(id); // Chama o método getCliente com o valor digitado
  }
}



  // Busca ORDEM SERVIÇO por id
  getOsPorId(id: number): void {
    this.servico.getOsPorId(id).subscribe(
      (data: Os) => {
        this.objetoOs = [data]; // Coloca o cliente dentro de um array
        this.os=data; // os recebe todos os dados de ordem de serviço
        console.log('O.S. obtida:', this.objetoOs);
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
    this.servico.getOsPorCodCli(codcli).subscribe(
      (data: Os[]) => { // Espera um array de os
        this.objetoOs = data; // Armazena todos os clientes retornados
        console.log('Os obtidas:', this.objetoOs);
        this.exibirTabela2 = true;
      },
      (error) => {
        if (error.status === 404) {
          alert(`Não há ordem de serviços para este código: ${codcli}.`);
        } else {
          console.error('Erro ao buscar clientes:', error);
          alert(`Erro ao buscar cliente com este código:  ${codcli}.`);
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
  // Escuta o input Ultimas O.S APOS DIGITAR O ENTER
onUltimasOsKey(event: KeyboardEvent): void {
  const inputElement = event.target as HTMLInputElement;
  const input = inputElement.value;

  // Verifica se a tecla Enter foi pressionada ou se o input tem 4 caracteres
  if (event.key === 'Enter') {
    const limite = parseInt(input, 10); // Converte o valor para número
    this.buscaUltimasOrdensServico(limite); // Chama o método com o valor digitado
  }
}

  // Busca ORDENS DE SERVIÇO PELA DATA DE ENTRADA
  buscaUltimasOrdensServico(limite: number): void {
    this.servico.getUltimasOrdensServicos(limite).subscribe(
      (data: Os[]) => { // Espera um array de os
        this.objetoOs = data; // Armazena todos os clientes retornados
        console.log('Ultimas os delimitadas:', this.objetoOs);
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
  if (event.key === 'Enter') {
    //const serial = parseInt(input, 10); // Converte o valor para número
    this.buscaOsPeloSerial(serial); // Chama o método com o valor digitado
  }
}

  // Busca ORDENS DE SERVIÇO PELA DATA DE ENTRADA
  buscaOsPeloSerial(serial: string): void {

    console.log(`serial dentro do metodo ${serial}`)

    this.servico.getOsPeloSerial(serial).subscribe(
     
      (data: Os[]) => { // Espera um array de os
        this.objetoOs = data; // Armazena todos os clientes retornados
        console.log('Busca Os pelo serial', this.objetoOs);
        this.exibirSerial = true
        this.exibirTabela2 = true;
      },
      (error) => {
        if (error.status === 404) {
          alert(`Não há ordem de serviços com este serial:  ${serial}.`);
        } else {
          console.error('Erro ao buscar clientes por cidade:', error);
          alert(`Não há ordem de serviços para este serial:  ${serial}.`);
        }
      }
    );
  }

  apagarOs(): void {
    console.log("Número da OS que será apagada: " + this.os.os);
    this.servico.deleteOs(this.os.os).subscribe({
      next: () => {
        this.exibirAlertSucessoDeletarOs = true;
        this.exibirNaoExisteMaisBancoDados = true;
      },
      error: (err) => {
        console.error("Erro ao deletar OS:", err);
        this.exibirErroDeletarOs = true;
      }
    });
  }
  

  reiniciarPagina(): void {
    window.location.reload();
  }

}
