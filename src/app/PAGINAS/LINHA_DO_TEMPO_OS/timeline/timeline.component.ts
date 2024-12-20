import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Step } from '../../../modelo/Step';
import { OrdemservicoService } from '../../../servico/ordemservico.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css'
})
export class TIMELINEComponent {


  constructor(

    private servico: OrdemservicoService,
    
) {}

  dataEntrada: string = ""
  dataOrca: string = ""
  dataFechamento: string = ""
  tipoParametroSelecionado: string = "";
  osMemorizada: any;
  status: string = "";
  
  ngOnInit(): void {
    const inputs = document.querySelectorAll<HTMLDivElement>('.input');
    const paras = document.querySelectorAll<HTMLParagraphElement>('.description-flex-container p');

    inputs.forEach((input, index) => {
      input.addEventListener("click", (): void => {
        // Adicionar classes "active" ao input clicado e ao parágrafo correspondente
        input.classList.add('active');
        paras[index]?.classList.add('active');

        // Remover classes "active" dos demais inputs e parágrafos
        inputs.forEach((otherInput, otherIndex) => {
          if (otherInput !== input) {
            otherInput.classList.remove('active');
          }
          if (otherIndex !== index) {
            paras[otherIndex]?.classList.remove('active');
          }
        });
      });
    });

    this.resgataOsMemorizada();
  }

  resgataOsMemorizada(){
    this.servico.os$.subscribe((osMemorizada) => {
      if (osMemorizada) {
        this.osMemorizada = osMemorizada;
        
        //console.log("Os resgatada no timeline:", this.osMemorizada);
        //console.log("Imprimindo a data que vem na os memorizada:", this.osMemorizada[0].data);
        //console.log("Imprimindo o status da osMemorizada", this.status);

      } else {
        console.log("osMemorizada está indefinida ou não foi carregada ainda");
      }
    });

       this.atrasoParaCarregarVariaveis();
       this.tipoParametroChange();
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
    }
    
  async atrasoParaCarregarVariaveis():Promise<void> {

     await this.delay(1000); // Atraso de 1000 ms = 1 segundo
     console.log("Imprimindo a data que vem na os memorizada depois do delay: ", this.osMemorizada[0].data);

     //this.dataEntrada = this.osMemorizada[0].data;

     ///PADRONIZA DATA ABERTURA
if (this.osMemorizada && this.osMemorizada.length > 0) {
  const dataOriginal = this.osMemorizada[0].data;

  // Verifica se a data é null ou uma string vazia
  if (dataOriginal === null || dataOriginal === "") {
    this.dataEntrada = ""; // Se for null ou vazio, define como ""
  } else {
    const dataObj = new Date(dataOriginal); // Cria um objeto Date a partir da string
  
    // Extrai o dia, mês e ano
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // getMonth() retorna mês entre 0-11, por isso somamos 1
    const ano = dataObj.getFullYear();
  
    // Formata a data para DD-MM-AAAA
    this.dataEntrada = `${dia}-${mes}-${ano}`;
  }

  console.log("Data formatada de Entrada: ", this.dataEntrada); // Ex: '14-11-2023' ou ''
} else {
  console.log("osMemorizada está indefinida ou não possui itens");
  this.dataEntrada = ""; // Se osMemorizada não tiver dados, também define como ""
}


    /// PADRONIZA DATA ORCAMENTO
if (this.osMemorizada && this.osMemorizada.length > 0) {
  const dataOriginal = this.osMemorizada[0]?.dataorca; // Acessa dataOrca com optional chaining
  
  console.log("Esta é a data original: ", dataOriginal);

  // Verifica se a data é null, undefined ou uma string vazia
  if (!dataOriginal) { 
    this.dataOrca = ""; // Se for null, undefined ou vazio, define como ""
  } else {
    const dataObj = new Date(dataOriginal); // Cria um objeto Date a partir da string
    
    if (isNaN(dataObj.getTime())) { 
      // Verifica se a dataObj é inválida
      console.error("Erro: dataOriginal não é uma data válida.");
      this.dataOrca = ""; // Define como vazio em caso de erro
    } else {
      // Extrai o dia, mês e ano
      const dia = String(dataObj.getDate()).padStart(2, '0');
      const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // getMonth() retorna 0-11
      const ano = dataObj.getFullYear();
  
      // Formata a data para DD-MM-AAAA
      this.dataOrca = `${dia}-${mes}-${ano}`;
    }
  }

  console.log("Data formatada de orçamento: ", this.dataOrca); // Ex: '14-11-2023' ou ''
} else {
  console.log("osMemorizada está indefinida ou não possui itens");
  this.dataOrca = ""; // Se osMemorizada não tiver dados, define como ""
}



    /// PADRONIZA DATA FECHAMENTO
if (this.osMemorizada && this.osMemorizada.length > 0) {
  const dataOriginal = this.osMemorizada[0]?.fechamento; // Acessa dataOrca com optional chaining
  
  console.log("Esta é a data original - fechamento: ", dataOriginal);

  // Verifica se a data é null, undefined ou uma string vazia
  if (!dataOriginal) { 
    this.dataFechamento = ""; // Se for null, undefined ou vazio, define como ""
  } else {
    const dataObj = new Date(dataOriginal); // Cria um objeto Date a partir da string
    
    if (isNaN(dataObj.getTime())) { 
      // Verifica se a dataObj é inválida
      console.error("Erro: dataOriginal não é uma data válida.");
      this.dataFechamento = ""; // Define como vazio em caso de erro
    } else {
      // Extrai o dia, mês e ano
      const dia = String(dataObj.getDate()).padStart(2, '0');
      const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // getMonth() retorna 0-11
      const ano = dataObj.getFullYear();
  
      // Formata a data para DD-MM-AAAA
      this.dataFechamento = `${dia}-${mes}-${ano}`;
    }
  }

  console.log("Data formatada de Fechamento: ", this.dataFechamento); // Ex: '14-11-2023' ou ''
} else {
  console.log("osMemorizada está indefinida ou não possui itens");
  this.dataFechamento = ""; // Se osMemorizada não tiver dados, define como ""
}
     
    }
    


////////////////DINAMICA PARA O TIME LINE///////////////////////
  
  async tipoParametroChange(): Promise<void>{

    await this.delay(1000); // Atraso de 1000 ms = 1 segundo

    this.status = this.osMemorizada[0].status;
    console.log(" status dentro do tipoParametroChange " + this.status)
    switch (this.status) {
      case "ABERTA":
        this.tipoParametroSelecionado = "ENTRADA";
        break;
        case "PASSAR ORÇ":
        this.tipoParametroSelecionado = "PASS_ORÇA";
        break;
        case "AGUARDANDO APROV":
        this.tipoParametroSelecionado = "AGUARD_APROV";
        break;
        case "APROVADO ORÇ":
        this.tipoParametroSelecionado = "ORÇAMENTO_APROVADO";
        break;
        case "FECHADA":
        this.tipoParametroSelecionado = "EQUIPAMENTO_RETIRADO";
        break;
        case "BAIXA":
        this.tipoParametroSelecionado = "EQUIPAMENTO_RETIRADO";
        break;
        case "NÃO APROVOU":
        this.tipoParametroSelecionado = "AGUARD_APROV";
        break;
        case "PEDIDO REALIZADO":
        this.tipoParametroSelecionado = "ANÁLISE_TÉCNICA";
        break;
        case "GARRADO":
        this.tipoParametroSelecionado = "ANÁLISE_TÉCNICA";
        break;
        case "EUDERMES":
        this.tipoParametroSelecionado = "ANÁLISE_TÉCNICA";
        break;
      default:
        console.warn(`Relatório ${status} não reconhecido.`);
    }

    //this.tipoParametroSelecionado = (event.target as HTMLSelectElement).value.toUpperCase(); // Converte para maiúsculas para evitar problemas de case sensitivity
  
    const inputs = document.querySelectorAll<HTMLDivElement>('.input');
  
    let activate = false; // Controle para ativar os elementos sequenciais
  
    inputs.forEach((input) => {
      const year = input.querySelector('span')?.getAttribute('data-year')?.toUpperCase();
  
      if (year === this.tipoParametroSelecionado) {
        activate = true; // Comece a ativar a partir deste ponto
      }
  
      // Adiciona ou remove a classe "active" com base no controle
      if (activate) {
        input.classList.add('active');
      } else {
        input.classList.remove('active');
      }
    });
  
    //console.log("Tipo de parâmetro selecionado: ", this.tipoParametroSelecionado);
  }
  
  
}
