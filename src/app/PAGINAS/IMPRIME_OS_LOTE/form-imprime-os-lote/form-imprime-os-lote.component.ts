import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ParametrosCombobox } from '../../../modelo/ParametrosCombobox';
import { Cliente } from '../../../modelo/Cliente';
import { Os } from '../../../modelo/Os';
import { FormControl, FormGroup } from '@angular/forms';
import { ParametrosService } from '../../../servico/parametros.service';
import { OrdemservicoService } from '../../../servico/ordemservico.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import html2pdf from 'html2pdf.js';
import { from, toArray } from 'rxjs';
import { mergeMap } from 'rxjs'; // Troque o concatMap por mergeMap
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs'; // Importe o 'of'
import { catchError, finalize } from 'rxjs/operators';



@Component({
  selector: 'app-form-imprime-os-lote',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-imprime-os-lote.component.html',
  styleUrl: './form-imprime-os-lote.component.css'
})
export class FORMIMPRIMEOSLOTEComponent {
  
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
  osClicadasCheckbox: any[] = [];
  spinnerLoading: boolean = false;

  ///////////CONTROLE DE RENDERIZAÇÃO/////////
  exibirTabela: boolean = false;
  exibirTabela2: boolean = false;
  exibirBotaoSalvar: boolean = false;
  exibirBotaoSair: boolean = false;
  exibirSerial: boolean = false
  escondeTabela: boolean = true;
  

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
      private cdr: ChangeDetectorRef,
      private zone: NgZone,
       private router: Router,
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
    this.spinnerLoading = true;
    this.servico.getOsPorId(id).subscribe(
      (data: Os) => {
        this.objetoOs = [data]; // Coloca o cliente dentro de um array
        console.log('O.S. obtida:', this.objetoOs);
        this.exibirTabela2 = true;
        this.spinnerLoading = false;
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
    this.spinnerLoading = true;
    this.servico.getOsPorCodCli(codcli).subscribe(
      (data: Os[]) => { // Espera um array de os
        this.objetoOs = data; // Armazena todos os clientes retornados
        console.log('Os obtidas:', this.objetoOs);
        this.exibirTabela2 = true;
         this.spinnerLoading = false;
      },
      (error) => {
        if (error.status === 404) {
          alert(`Não há ordem de serviços cadastrados na cidade ${codcli}.`);
        } else {
          console.error('Erro ao buscar clientes por cidade:', error);
          alert(`Erro ao buscar clientes na cidade ${codcli}.`);
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
    this.spinnerLoading = true;
    this.servico.getOsPorDadaEntrada(dataEntrada).subscribe(
      (data: Os[]) => { // Espera um array de os
        this.objetoOs = data; // Armazena todos os clientes retornados
        console.log('Os obtidas por data de entrada:', this.objetoOs);
        this.exibirTabela2 = true;
        this.spinnerLoading = false;
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
    this.spinnerLoading = true;
    this.servico.getUltimasOrdensServicos(limite).subscribe(
      (data: Os[]) => { // Espera um array de os
        this.objetoOs = data; // Armazena todos os clientes retornados
        console.log('Ultimas os delimitadas:', this.objetoOs);
        this.exibirTabela2 = true;
        this.spinnerLoading = false;
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

    this.spinnerLoading = true;
    console.log(`serial dentro do metodo ${serial}`)

    this.servico.getOsPeloSerial(serial).subscribe(
     
      (data: Os[]) => { // Espera um array de os
        this.objetoOs = data; // Armazena todos os clientes retornados
        console.log('Busca Os pelo serial', this.objetoOs);
        this.exibirSerial = true
        this.exibirTabela2 = true;
        this.spinnerLoading = false;
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

  ///PEGA AS OS COM CHECKBOX CLICADAS E COLOCA DENTRO DE UM ARRAY////
  onCheckboxChange(index: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked; // Obtém o estado do checkbox
    this.objetoOs[index].selected = isChecked; // Atualiza a propriedade 'selected' no objeto correspondente
  
  
    // Adiciona ou remove o objeto do array osClicadasCheckbox
    if (isChecked) {
      // Adiciona ao array se não estiver presente
      this.osClicadasCheckbox.push(this.objetoOs[index]);
    } else {
      // Remove do array se estiver presente
      this.osClicadasCheckbox = this.osClicadasCheckbox.filter(
        (os) => os.os !== this.objetoOs[index].os // Filtra pelo identificador único (ex.: `os`)
      );
    }
  
    // Logs para verificação
    console.log(`Checkbox na linha ${index} foi clicado.`);
    console.log(`Estado do atributo 'selected':`, this.objetoOs[index].selected);
    console.log('Objeto completo atualizado:', this.objetoOs[index]);
    console.log('Array de ordens de serviço selecionadas:', this.osClicadasCheckbox);
    console.log("quantidade de os selecionadas: " + this.osClicadasCheckbox.length )
    if(this.osClicadasCheckbox.length>30){
      alert("Você ultrapassou o limite máximo (30) de ordens de serviço selecionadas para impressão. Click em imprimir estas ordens de serviço e depois selecione mais, se for necessário.")
    }
  }

  

//////ATUALIZA ORDEM DE SERVIÇO - MUDA STATUS E DATA PARA "FECHADA" //////////////////////////////

processarOSSelecionadas() {

  
  console.log('Iniciando processamento de:', this.osClicadasCheckbox.length);
  this.spinnerLoading = true;

  from(this.osClicadasCheckbox).pipe(
    mergeMap(osItem => {
      const dadosFormatados = this.geraObjetoOs(osItem);
      
      // O segredo está em tratar o erro AQUI DENTRO
      return this.servico.atualizarOrdemServico(osItem.os, dadosFormatados).pipe(
        catchError(error => {
          console.error(`Erro na OS ${osItem.os}:`, error);
          return of(null); // Retorna nulo mas NÃO mata o fluxo das outras 29
        })
      );
    }, 2), // Reduzi para 2 para dar mais estabilidade ao seu banco local
    toArray(), // Aguarda as 30 respostas (ou nulos)
    finalize(() => {
      // O finalize é disparado APENAS quando o fluxo fecha de vez
      console.log('Fluxo RxJS finalizado totalmente.');
      
    })
  ).subscribe({
    next: (resultados) => {
      const processadosComSucesso = resultados.filter(r => r !== null).length;
      console.log(`Sucesso em ${processadosComSucesso} de ${resultados.length}`);
      
      // Só gera o PDF quando o array de resultados estiver cheio
      if (processadosComSucesso > 0) {
        console.log(" Está dentro do processsados com sucesso ", this.osClicadasCheckbox.length)
    
        setTimeout(() => this.gerarPDF(), 200);
      }
    }
  });
}


atualizarOS(id: number, osItem: any) {
  // Gera o objeto OS preenchendo com os dados do osItem
  this.geraObjetoOs(osItem);  // Passa o osItem para o método que vai preencher o objeto os

  console.log("Este é o id que será enviado para o serviço: " + id);
  console.log("Este é o objeto que será enviado para o serviço: ", JSON.stringify(this.os, null, 2));

  // Chama o serviço para atualizar a OS no servidor
  this.servico.atualizarOrdemServico(id, this.os).subscribe({
    next: (osAtualizado) => {
      console.log("Ordem de serviço atualizada com sucesso:", osAtualizado);
    },
    error: (erro) => {
      console.error("Erro ao atualizar a ordem de serviço:", erro);
    },
  });
}

geraObjetoOs(osItem: any) {
  // Reutilize sua lógica de data que você sabe que funciona
  const dataHoje = new Date();
  const ano = dataHoje.getFullYear();
  const mes = String(dataHoje.getMonth() + 1).padStart(2, '0');
  const dia = String(dataHoje.getDate()).padStart(2, '0');
  const hora = String(dataHoje.getHours()).padStart(2, '0');
  const minutos = String(dataHoje.getMinutes()).padStart(2, '0');
  const segundos = String(dataHoje.getSeconds()).padStart(2, '0');
  const milissegundos = String(dataHoje.getMilliseconds()).padStart(3, '0');
  
  // Voltando ao seu formato original (sem o Z no final)
  const dataHojeFormatada = `${ano}-${mes}-${dia}T${hora}:${minutos}:${segundos}.${milissegundos}`;

  // Monte o objeto explicitamente (Como você fez na segunda mensagem)
  // Isso garante que NENHUM campo nulo ou inesperado vá para a API
  const objetoParaRetorno = {
      ...osItem, // Base
      atendente: String(osItem.atendente || ""),
      codcli: Number(osItem.codcli || 0),
      fantasia: String(osItem.fantasia || ""),
      fechamento: dataHojeFormatada,
      status: "FECHADA",
      os: Number(osItem.os || 0),
      // Adicione aqui apenas os campos que o seu DTO no Java exige
  };

  this.os = objetoParaRetorno; 
  return objetoParaRetorno; 
}

gerarPDF = () => {

  this.escondeTabela = false;
  const element = document.getElementById('pdf-content');

  const options = {
    margin: 0, // Margem zero para controle total via CSS
    filename: 'documento.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 0.9, // Aumentado para 2 para melhor nitidez em textos pequenos
      letterRendering: true,
      useCORS: true,
      scrollY: 0, // Garante que a captura comece do topo do elemento
      windowWidth: element?.scrollWidth // Estabiliza a largura da captura
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true
    },
    pagebreak: {
      // avoid-all impede que elementos internos sejam cortados ao meio
      mode: ['css', 'legacy'], 
      //after: '.quebra-pagina',
    },
  };

  html2pdf()
    .set(options)
    .from(element)
    .toPdf()
    .get('pdf')
    .then((pdf: any) => {
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
    })
    .catch((error: any) => {
      console.error('Erro ao gerar o PDF:', error);
    });

    this.spinnerLoading = false;

}

limpar(event?: MouseEvent) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  this.router.navigate(['/home']).then(() => {
    this.router.navigate(['os/lote/imprime']);
  });
}

}