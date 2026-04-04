
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { ParametrosCombobox } from '../../../modelo/ParametrosCombobox';
import { ParametrosService } from '../../../servico/parametros.service';
import { OrdemservicoService } from '../../../servico/ordemservico.service';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-parametros',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-parametros.component.html',
  styleUrl: './form-parametros.component.css'
})
export class FORMPARAMETROSComponent {

  //@ViewChild('numOsInput') numOsInput!: ElementRef;
  cidades: any [] = [];
  tipoParametroSelecionado: string = "";
  acaoSelecionada: string = "";
  id:number = 0;
  parametroIserido: string = "";
  arrayTabela: any[] = [];
  exibirInputId: boolean = true;
  exibirInputNomeParametro: boolean = true;

  // CONFIGURA FORMULÁRIO
  formulario = new FormGroup({
    os:new FormControl(''),
    tipoParametro: new FormControl(''),
    acao: new FormControl(''),
    inserirParametro: new FormControl(''),
    id: new FormControl(''),
     });

     constructor(
      private parametrosService: ParametrosService, 
      private servico: OrdemservicoService,
      private cdr: ChangeDetectorRef,
      private router: Router
  ) {}


  ////////////////ESCUTA OS SELECT'S /////////////////////////////////////////////////

// ESCUTA O SELECT AÇÃO:
acaoChange(event: Event): void {

  
 this.acaoSelecionada = (event.target as HTMLSelectElement).value; // Atualiza a cidade selecionada
  if(this.acaoSelecionada=="ADICIONAR PARAMETRO"){
    this.exibirInputId = false
  }

  if(this.acaoSelecionada=="APAGAR PARAMETRO"){
    this.exibirInputNomeParametro = false;
  }

}

// Escuta o input ID após digitar 3 caracteres ou digitar tab
onIdKey(event: Event): void {
  const inputElement = event.target as HTMLInputElement;
  const input = inputElement.value;

  // Verifica se o input tem 3 caracteres ou se o evento foi gerado pelo Tab
 // if (input.length === 3 || (event instanceof KeyboardEvent && event.key === 'Tab')) {
    this.id = parseInt(input, 10); // Converte o valor para número
 // }
}

// Escuta o input INSERIR PARAMETRO
inserirParametroKey(event: Event): void {
  const inputElement = event.target as HTMLInputElement;
  this.parametroIserido = inputElement.value.toUpperCase();
}

///////////////PESQUISA PARAMETRO///////////////////////
tipoParametroChange(event: Event): void {
  this.tipoParametroSelecionado = (event.target as HTMLSelectElement).value; // Atualiza a cidade selecionada
  console.log(" tipo de parâmetro Selecionado: " + this.tipoParametroSelecionado)
  
  const tipoParametro = this.tipoParametroSelecionado
  switch (tipoParametro) {
    case "CIDADE":
      this.buscarCidades();
      break;
      case "ATENDENTES":
      this.buscarAtendentes();
      break;
      case "COR":
      this.buscarCores();
      break;
      case "DEFEITOS CLIENTES":
      this.buscarDefeitosClientes();
      break;
      case "EQUIPAMENTO":
      this.buscarEquipamentos();
      break;
      case "MARCA ACESSÓRIO":
      this.buscarMarcasAcessorios();
      break;
      case "MARCA BATERIA":
      this.buscarMarcasBaterias();
      break;
      case "MARCA ESTABILIZADOR":
      this.buscarMarcasEstabilizadores();
      break;
      case "MARCA MONITOR":
      this.buscarMarcasMonitores();
      break;
      case "MARCA NOBREAK":
      this.buscarMarcasNobreaks();
      break;
      case "MATERIAIS":
      this.buscarMaterial();
      break;
      case "MODELO ACESSORIO":
      this.buscarModelosAcessorios();
      break;
      case "MODELO BATERIA":
      this.buscarModelosBaterias();
      break;
      case "MODELO ESTABILIZADOR":
      this.buscarModelosEstabilizadores();
      break;
      case "MODELO MONITOR":
      this.buscarModelosMonitores();
      break;
      case "MODELO NOBREAK":
      this.buscarModelosNobreaks();
      break;
      case "SEGMENTO":
      this.buscarSegmentos();
      break;
      case "STATUS":
      this.buscarStatusOs();
      break;
      case "TAREFA EXECUTADA":
      this.buscarTarefaExecutada();
      break;
      case "TECNICO":
      this.buscarTecnico();
      break;
      case "TOPOLOGIA BATERIA":
      this.buscarTopologiaBaterias();
      break;
      case "TOPOLOGIA ESTABIIZADORES":
      this.buscarTopologiaEstabilizadores();
      break;
      case "TOPOLOGIA MONITOR":
      this.buscarTopologiaMonitores();
      break;
      case "TOPOLOGIA NOBREAK":
      this.buscarTopologiaNobreaks();
      break;
    default:
      console.warn(`Relatório ${status} não reconhecido.`);
  }

}
  
  // busca as cidades no parametro para popular o select
  buscarCidades(): void {
    this.parametrosService?.getCidades().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarAtendentes(): void {
    this.parametrosService?.getAtendentes().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarCores(): void {
    this.parametrosService?.getCores().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarDefeitosClientes(): void {
    this.parametrosService?.getDefeitos().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarEquipamentos(): void {
    this.parametrosService?.getEquipamentos().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarMarcasAcessorios(): void {
    this.parametrosService?.getMarcasAcessorios().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarMarcasBaterias(): void {
    this.parametrosService?.getMarcasBaterias().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarMarcasEstabilizadores(): void {
    this.parametrosService?.getMarcasEstabilizadores().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarMarcasMonitores(): void {
    this.parametrosService?.getMarcasMonitores().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarMarcasNobreaks(): void {
    this.parametrosService?.getMarcasNobreaks().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarMaterial(): void {
    this.parametrosService?.getMaterial().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarModelosAcessorios(): void {
    this.parametrosService?.getMOdelosAcessorios().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarModelosBaterias(): void {
    this.parametrosService?.getMOdelosBaterias().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarModelosEstabilizadores(): void {
    this.parametrosService?.getMOdelosEstabizadores().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarModelosMonitores(): void {
    this.parametrosService?.getMOdelosMonitores().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarModelosNobreaks(): void {
    this.parametrosService?.getModelosNobreaks().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarSegmentos(): void {
    this.parametrosService?.getSegmentos().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarStatusOs(): void {
    this.parametrosService?.getStatusOs().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarTarefaExecutada(): void {
    this.parametrosService?.getTarefaExecutada().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarTecnico(): void {
    this.parametrosService?.getTecnicos().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarTopologiaBaterias(): void {
    this.parametrosService?.getTopologiaBaterias().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarTopologiaEstabilizadores(): void {
    this.parametrosService?.getTopologiaEstabilizadores().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarTopologiaMonitores(): void {
    this.parametrosService?.getTopologiaMonitores().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }
  buscarTopologiaNobreaks(): void {
    this.parametrosService?.getTopologiaNobreaks().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.arrayTabela = dados;
},   
    );
  }


  ////ANALISANDO QUAL PARTE DO CRUD SERÁ EXECUTADO////////////////////////////////
  processaParametro() {
    if (this.acaoSelecionada === "ADICIONAR PARAMETRO" && this.tipoParametroSelecionado && this.parametroIserido) {
      this.enviarParametro();
      return; // Interrompe a execução para evitar o próximo bloco
    } else if (this.acaoSelecionada === "APAGAR PARAMETRO" && this.tipoParametroSelecionado && this.id) {
      this.apagaParametro();
      return; // Interrompe a execução para evitar o bloco `else`
    } else if (this.acaoSelecionada === "ALTERAR PARAMETRO" && this.tipoParametroSelecionado && this.id && this.parametroIserido) {
      this.modificaParanetro();
      return; // Interrompe a execução para evitar o bloco `else`
    } else {
      alert("Você precisa selecionar um tipo de parâmetro, uma ação e um nome de parâmetro antes de processar!");
    }
  }
  


  ///////////////////////////ADICIONANDO UM PARÂMETRO/////////////////////////////
    enviarParametro() {

      const novoParametro = { // CRIA O CORPO DA REQUISIÇÃO
        parametro: this.tipoParametroSelecionado,
        valor: this.parametroIserido
      };

      if (this.arrayTabela.some(item => item.valor === this.parametroIserido)) { // VERIFICA SE O PARÂMETRO JÁ EXISTE
        alert('Já existe o item ' + this.parametroIserido + " no parametro tipo " + this.tipoParametroSelecionado);
        return;
      }
  

    this.parametrosService.createParametro(novoParametro).subscribe({ // CHAMA O SERVICE QUE IRÁ ADICIONAR O PARAMENTRO NO BANCO
      next: (response) => {
        console.log('Parâmetro criado com sucesso:', response);
        alert(" O parâmetro do tipo " + this.tipoParametroSelecionado + " com valor " + this.parametroIserido + " foi salvo com sucesso !")
      },
      error: (error) => {
        console.error('Erro ao criar parâmetro:', error);
        alert(" Ocorreu algum ERRO ao tentar inserir o tipo de parâmetro " + this.tipoParametroSelecionado + " com valor " + this.parametroIserido + " foi salvo com sucesso !")
      }
    });
  }
  

/////APAGA PARAMETRO//////////////////////////////
apagaParametro() {
  const confirmacao = confirm("Você tem certeza sobre apagar o parametro do tipo " + this.tipoParametroSelecionado + " ?");

  if (!confirmacao) {
    return; // Interrompe a execução se a resposta for 'Não'
  }

  this.parametrosService.deleteParametro(this.id).subscribe({
    next: (response) => {
      alert('Parâmetro ' + this.id + ' excluído com sucesso:');
    },
    error: (error) => {
      alert('ERRO ao excluir o Parâmetro ' + this.id);
    }
  });
}

////ALTERAR PARÂMETRO////////////////////////////

modificaParanetro(){

  this.parametrosService.updateParametro(this.id, this.tipoParametroSelecionado, this.parametroIserido).subscribe({
    next: (response) => {
      alert('O parametro '+ this.tipoParametroSelecionado +' teve o seu valor alterado para ' + this.parametroIserido + ' com sucesso !!!');
    },
    error: (error) => {
      alert('ERRO ao modificar o  parametro '+ this.tipoParametroSelecionado +' com o valor ' + this.parametroIserido );
    }
  });
}

limpar() {
  // Navega para a primeira rota
  this.router.navigate(['/home']).then(() => {
    // Após a navegação para 'home', navega para 'parametros'
    this.router.navigate(['/parametros']);
  });
}



}


