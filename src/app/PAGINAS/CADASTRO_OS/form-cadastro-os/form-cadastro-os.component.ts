import { Component } from '@angular/core';
import { ParametrosCombobox } from '../../../modelo/ParametrosCombobox';
import { ParametrosService } from '../../../servico/parametros.service';
import { OrdemservicoService } from '../../../servico/ordemservico.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from '../../../modelo/Cliente';
import { CommonModule } from '@angular/common';
import { Os } from '../../../modelo/Os';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import QRCode from 'qrcode';



@Component({
  selector: 'app-form-cadastro-os',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-cadastro-os.component.html',
  styleUrl: './form-cadastro-os.component.css'
})
export class FORMCADASTROOSComponent {

  
  cidades: ParametrosCombobox[] = [];
  cidadeSelecionada: string = "";
  cidadesPosicaoZero: any = { id: 100, parametro: 'SEGMENTO', valor: 'CIDADES' }; // para não iniciar com um nome de cidade e sim "cidades"

  equipamentos: ParametrosCombobox[] = [];
  equipamentoSelecionado: string = "";
  equipamentosPosicaoZero: any = { id: 100, parametro: 'EQUIPAMENTO', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  marcasNobreaks: ParametrosCombobox[] = [];
  marcaSelecionada: string = "";
  marcaNobreakPosicaoZero: any = { id: 100, parametro: 'MARCANOBREAK', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  modelosNobreaks: ParametrosCombobox[] = [];
  modeloSelecionada: string = "";
  modeloNobreakPosicaoZero: any = { id: 100, parametro: 'MODELONOBREAK', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  topologiasNobreaks: ParametrosCombobox[] = [];
  topologiaSelecionada: string = "";
  topologiaNobreakPosicaoZero: any = { id: 100, parametro: 'TOPOLOGIANOBREAK', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  marcasMonitores: ParametrosCombobox[] = [];
  marcaMonitorSelecionada: string = "";
  marcaMonitorPosicaoZero: any = { id: 100, parametro: 'MARCAMONITOR', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  modelosMonitores: ParametrosCombobox[] = [];
  modeloMonitorSelecionado: string = "";
  modeloMonitorPosicaoZero: any = { id: 100, parametro: 'MODELOMONITOR', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  topologiasMonitor: ParametrosCombobox[] = [];
  topologiaMonitorSelecionada: string = "";
  topologiaMonitorPosicaoZero: any = { id: 100, parametro: 'TOPOLOGIAMONITOR', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  marcasBaterais: ParametrosCombobox[] = [];
  marcaBateriaSelecionada: string = "";
  marcaBateriaPosicaoZero: any = { id: 100, parametro: 'MARCABateria', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  modelosBateria: ParametrosCombobox[] = [];
  modeloBateriaSelecionado: string = "";
  modeloBateriaPosicaoZero: any = { id: 100, parametro: 'MODELOMONITOR', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  topologiasBateria: ParametrosCombobox[] = [];
  topologiaBateriaSelecionada: string = "";
  topologiaBateriaPosicaoZero: any = { id: 100, parametro: 'TOPOLOGIAMONITOR', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  marcasEstabilizador: ParametrosCombobox[] = [];
  marcaEstabilizadorSelecionada: string = "";
  marcaEstabilizadorPosicaoZero: any = { id: 100, parametro: 'MARCAEstabilizador', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  modelosEstabilizador: ParametrosCombobox[] = [];
  modeloEstabilizadorSelecionado: string = "";
  modeloEstabilizadorPosicaoZero: any = { id: 100, parametro: 'MODELOEstabilizador', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  topologiasEstabilizador: ParametrosCombobox[] = [];
  topologiaEstabilizadorSelecionada: string = "";
  topologiaEstabilizadorPosicaoZero: any = { id: 100, parametro: 'TOPOLOGIAEstabilizador', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  marcasAcessorio: ParametrosCombobox[] = [];
  marcaAcessorioSelecionada: string = "";
  marcaAcessorioPosicaoZero: any = { id: 100, parametro: 'MARCAAcessorio', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  modelosAcessorio: ParametrosCombobox[] = [];
  modeloAcessorioSelecionado: string = "";
  modeloAcessorioPosicaoZero: any = { id: 100, parametro: 'MODELOAcessorio', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  topologiasAcessorio: ParametrosCombobox[] = [];
  topologiaAcessorioSelecionada: string = "";
  topologiaAcessorioPosicaoZero: any = { id: 100, parametro: 'TOPOLOGIAAcessorio', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"


  cores: ParametrosCombobox[] = [];
  corSelecionada: string = "";
  corPosicaoZero: any = { id: 100, parametro: 'COR', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  defeitosCliente: ParametrosCombobox[] = [];
  defeitoCliente1Selecionado: string = "";
  defeitoCliente2Selecionado: string = "";

  defeitoClientePosicaoZero: any = { id: 100, parametro: 'DEFEITOS CLIENTES', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  atendentes: ParametrosCombobox[] = [];
  atendenteSelecionado: string = "";
  atendenteClientePosicaoZero: any = { id: 100, parametro: 'DEFEITOS CLIENTES', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  segmentos: ParametrosCombobox[] = [];
  segmentoSelecionado: string = "";
  segmentosPosicaoZero: any = { id: 100, parametro: 'SEGMENTO', valor: 'SEGMENTOS' };

  vendaSelecionada: string;
  garantiaSelecionada: string;

  cliente: Cliente = new Cliente();
  os: Os = new Os();
  novocliente: number = 0;
  ultimoCliente: number = 0;
  objetocliente: Cliente[] = [];
  ultimaOs: number = 0;
  novaOs: number = 0;
  osParaImprimir: number = 0
  objetoOs: any[]=[];
  
  urlQrcod: string = 'https://app.somonitores.tec.br/';
  qrCodeUrl: string = '';


  ///////////CONTROLE DE RENDERIZAÇÃO/////////
  exibirTabela: boolean = false;
  exibirlinha1: boolean = true;
  exibirlinha2: boolean = true;
  exibirlinha3: boolean = true;
  exibirNumeroNovaOs: boolean = false;
  exibirBotaoSalvar: boolean = true;
  exibirBotaoSair: boolean = false;
  exibirAlertValidacao: boolean = false
  textoOscadastradaSucesso: boolean= false
  exibirComprovante: boolean =false;
  exibirBotaoImprimir: boolean = false;
  exibirBotaoImprimeOutrasOs: boolean = true;
  exibirInputsMarcaModeloTopologiaAoImprir: boolean = false;

  nobreak: boolean =false;
  monitor: boolean=false;
  bateria: boolean=false;
  estabilizador: boolean=false;
  acessorios: boolean = false;

  

  // CONFIGURA FORMULÁRIO
  formulario = new FormGroup({
    os:new FormControl(''),
    data:new FormControl(''),
    hora:new FormControl(''),
    fantasia:new FormControl(''),
    rzsocial:new FormControl(''),
    codcli:new FormControl('', Validators.required),
    atendente:new FormControl('', Validators.required),
    status:new FormControl(''),
    prioridade:new FormControl(''),
    equipamento:new FormControl('', Validators.required),
    marca:new FormControl('', Validators.required),
    modelo:new FormControl('', Validators.required),
    topologia:new FormControl(''),
    cor: new FormControl(''),
    serial:new FormControl('', Validators.required),
    patrimonio:new FormControl(''),
    obs1:new FormControl(''),
    obs2:new FormControl(''),
    defeito1:new FormControl('', Validators.required),
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
    garantia:new FormControl('', Validators.required),
    dataorca:new FormControl(''),
    osoriginal:new FormControl(''),
    venda:new FormControl('', Validators.required),
    modelofake:new FormControl(''),
    obs3:new FormControl(''),
    jaimp:new FormControl(''),
    top10:new FormControl(''),
    dataretro:new FormControl(''),
     });

     constructor(
      private router: Router,
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

// ESCUTA O SELECT EQUIPAMENTOS
onEquipamentoChange(event: Event): void {
  this.equipamentoSelecionado = (event.target as HTMLSelectElement).value;
  console.log(this.equipamentoSelecionado);

  //////////////////// CARREGA AS MARCAS PARA O SELECT DE ACORDO COM O EQUIPAMENTO ////////////////////
  if(this.equipamentoSelecionado=="NOBREAK"){
    this.nobreak = true
    this.monitor=false;
    this.bateria=false;
    this.estabilizador=false;
    this.acessorios= false;
    this.getMarcaOptions();
  }
  if(this.equipamentoSelecionado=="MONITOR"){
    this.nobreak = false;
    this.monitor=true;
    this.bateria=false;
    this.estabilizador=false;
    this.acessorios= false;
    this.getMarcaOptions();
  }
  if(this.equipamentoSelecionado=="BATERIA"){
    this.nobreak = false;
    this.monitor=false;
    this.bateria=true;
    this.estabilizador=false;
    this.acessorios= false;
    this.getMarcaOptions();
  }
  if(this.equipamentoSelecionado=="ESTABILIZADOR"){
    this.nobreak = false
    this.monitor=false;
    this.bateria=false;
    this.estabilizador=true;
    this.acessorios= false;
    this.getMarcaOptions();
  }
  if(this.equipamentoSelecionado=="ACESSORIOS"){
    this.nobreak = false;
    this.monitor=false;
    this.bateria=false;
    this.estabilizador=false;
    this.acessorios= true;
    this.getMarcaOptions();
  } 
}

// ESCUTA O SELECT MODELO
onModeloChange(event: Event): void {
  this.modeloSelecionada = (event.target as HTMLSelectElement).value;
  console.log(this.modeloSelecionada); 

  ///////////////CARREGA OS MODELOS DO SELECT MODELO///////////////////
  if(this.equipamentoSelecionado=="NOBREAK"){
    this.nobreak = true
    this.monitor=false;
    this.bateria=false;
    this.estabilizador=false;
    this.acessorios= false;
    this.getModeloOptions();
  }
  if(this.equipamentoSelecionado=="MONITOR"){
    this.nobreak = false;
    this.monitor=true;
    this.bateria=false;
    this.estabilizador=false;
    this.acessorios= false;
    this.getModeloOptions();
  }
  if(this.equipamentoSelecionado=="BATERIA"){
    this.nobreak = false;
    this.monitor=false;
    this.bateria=true;
    console.log(" bateria é true")
    this.estabilizador=false;
    this.acessorios= false;
    this.getModeloOptions();
  }
  if(this.equipamentoSelecionado=="ESTABILIZADOR"){
    this.nobreak = false
    this.monitor=false;
    this.bateria=false;
    this.estabilizador=true;
    this.acessorios= false;
    this.getModeloOptions();
  }
  if(this.equipamentoSelecionado=="ACESSORIO"){
    this.nobreak = false;
    this.monitor=false;
    this.bateria=false;
    this.estabilizador=false;
    this.acessorios= true;
    this.getModeloOptions();
  } 

}

// ESCUTA O SELECT TOPOLOGIA
onTopologiaChange(event: Event): void {
  this.topologiaSelecionada = (event.target as HTMLSelectElement).value;
  console.log(this.topologiaSelecionada); 

///////////////CARREGA OS OPTIONS DO SELECT TOPOLOGIA///////////////////
  if(this.equipamentoSelecionado=="NOBREAK"){
    this.nobreak = true
    this.monitor=false;
    this.bateria=false;
    this.estabilizador=false;
    this.acessorios= false;
    this.getTopologiaOptions();
  }
  if(this.equipamentoSelecionado=="MONITOR"){
    this.nobreak = false;
    this.monitor=true;
    this.bateria=false;
    this.estabilizador=false;
    this.acessorios= false;
    this.getTopologiaOptions();
  }
  if(this.equipamentoSelecionado=="BATERIA"){
    this.nobreak = false;
    this.monitor=false;
    this.bateria=true;
    console.log(" bateria é true")
    this.estabilizador=false;
    this.acessorios= false;
    this.getTopologiaOptions();
  }
  if(this.equipamentoSelecionado=="ESTABILIZADOR"){
    this.nobreak = false
    this.monitor=false;
    this.bateria=false;
    this.estabilizador=true;
    this.acessorios= false;
    this.getTopologiaOptions();
  }
  if(this.equipamentoSelecionado=="ACESSORIO"){
    this.nobreak = false;
    this.monitor=false;
    this.bateria=false;
    this.estabilizador=false;
    this.acessorios= true;
    this.getTopologiaOptions();
  } 

}

getMarcaOptions() {
  if (this.nobreak) return this.marcasNobreaks;
  if (this.monitor) return this.marcasMonitores;
  if (this.bateria) return this.marcasBaterais;
  if (this.estabilizador) return this.marcasEstabilizador;
  if (this.acessorios) return this.marcasAcessorio;
  return []; // Retorna uma lista vazia se nenhum for selecionado
}

getModeloOptions() {
  if (this.nobreak) return this.modelosNobreaks;
  if (this.monitor) return this.modelosMonitores;
  if (this.bateria) return this.modelosBateria;
  if (this.estabilizador) return this.modelosEstabilizador;
  if (this.acessorios) return this.modelosAcessorio;
  return []; // Retorna uma lista vazia se nenhum for selecionado
}

getTopologiaOptions() {
  if (this.nobreak) return this.topologiasNobreaks;
  if (this.monitor) return this.topologiasMonitor;
  if (this.bateria) return this.topologiasBateria;
  if (this.estabilizador) return this.topologiasNobreaks;
  if (this.acessorios) return this.topologiasAcessorio;
  return []; // Retorna uma lista vazia se nenhum for selecionado
}

// ESCUTA O SELECT MARCA
onMarcaChange(event: Event): void {
  this.marcaSelecionada = (event.target as HTMLSelectElement).value;
  console.log(this.marcaSelecionada); 
}

// ESCUTA O SELECT CORES
onCorChange(event: Event): void {
  this.corSelecionada = (event.target as HTMLSelectElement).value;
  console.log(this.marcaSelecionada); 
}

// ESCUTA O SELECT DEFEITO CLIENTE
onDefeitoCliente1Change(event: Event): void {
  this.defeitoCliente1Selecionado = (event.target as HTMLSelectElement).value;
  console.log(this.defeitoCliente1Selecionado); 
}

// ESCUTA O SELECT DEFEITO CLIENTE
onDefeitoCliente2Change(event: Event): void {
  this.defeitoCliente2Selecionado = (event.target as HTMLSelectElement).value;
  console.log(this.defeitoCliente2Selecionado); 
}

// ESCUTA O SELECT ATENDENTE
onAtendenteChange(event: Event): void {
  this.atendenteSelecionado = (event.target as HTMLSelectElement).value;
  console.log(this.atendenteSelecionado); 
}

// ESCUTA O SELECT VENDA
onVendaChange(event: Event): void {
  this.vendaSelecionada = (event.target as HTMLSelectElement).value;
  console.log(this.vendaSelecionada); 
}

// ESCUTA O SELECT GARANTIA
onGarantiaChange(event: Event): void {
  this.garantiaSelecionada = (event.target as HTMLSelectElement).value;
  console.log(this.garantiaSelecionada); 
}

  // CONFIGURA AS FUNÇÕES QUE SERÃO EXECUTADAS NA INICIALIZAÇÃO DA PÁGINA
  ngOnInit(): void {
    if (this.parametrosService) {
      this.buscarCidades();
      this.buscarEquipamentos();
      this.buscarCor();
      this.buscarDefeitosCliente();
      this.buscarAtendente();
      this.buscaUltimaOs();
     // this.ativarFullscreen();
      this.buscarMarcasNobreaks();
      this.buscarMarcasMonitores();
      this.buscarMarcasBateria();
      this.buscarMarcasEstabilizador();
      this.buscarMarcasAcessorio();
      this.buscarModelosNobreaks();
      this.buscarModelosMonitores();
      this.buscarModelosBateria();
      this.buscarModelosEstabilizador();
      this.buscarModelosAcessorio();
      this.buscarTopologiaNobreaks();
      this.buscarTopologiaMonitores();
      this.buscarTopologiaBateria();

    }

   
    QRCode.toDataURL(this.urlQrcod, { width: 300 })  // Define o tamanho para 300x300
  .then((url) => {
    this.qrCodeUrl = url;
  })
  .catch((err) => {
    console.error('Erro ao gerar QR Code', err);
  });



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

  
  // busca as cidades no parametro para popular o select
  buscarEquipamentos(): void {
    this.parametrosService?.getEquipamentos().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.equipamentos = dados;
        this.equipamentos.unshift(this.equipamentosPosicaoZero);
        console.log(this.equipamentos);
      },
      (erro) => {
        console.error('Erro ao buscar Equipamentos:', erro);
      }
    );
  }

  // busca as marcas de nobreak no parametro para popular o select
  buscarMarcasNobreaks(): void {
    this.parametrosService?.getMarcasNobreaks().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.marcasNobreaks = dados;
        this.marcasNobreaks.unshift(this.marcaNobreakPosicaoZero);
        console.log(this.marcasNobreaks);
      },
      (erro) => {
        console.error('Erro ao buscar Equipamentos:', erro);
      }
    );
  }

  // busca as marcas de nobreak no parametro para popular o select
  buscarModelosNobreaks(): void {
    this.parametrosService?.getModelosNobreaks().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.modelosNobreaks = dados;
        this.modelosNobreaks.unshift(this.modeloNobreakPosicaoZero);
        console.log(this.modelosNobreaks);
      },
      (erro) => {
        console.error('Erro ao buscar Equipamentos:', erro);
      }
    );
  }

  buscarTopologiaNobreaks(): void {
    this.parametrosService?.getTopologiaNobreaks().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.topologiasNobreaks = dados;
        this.topologiasNobreaks.unshift(this.topologiaNobreakPosicaoZero);
        console.log(this.modelosNobreaks);
      },
      (erro) => {
        console.error('Erro ao buscar Equipamentos:', erro);
      }
    );
  }

  // busca as marcas de nobreak no parametro para popular o select
  buscarMarcasMonitores(): void {

    console.log( "entrou em buscar marcas monitores")
    this.parametrosService?.getMarcasMonitores().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.marcasMonitores = dados;
        this.marcasMonitores.unshift(this.marcaMonitorPosicaoZero);
        console.log(this.marcasMonitores);
      },
      (erro) => {
        console.error('Erro ao buscar Marca Monitor:', erro);
      }
    );
  }

  // busca as marcas de monitores no parametro para popular o select
  buscarModelosMonitores(): void {
    this.parametrosService?.getMOdelosMonitores().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.modelosMonitores = dados;
        this.modelosMonitores.unshift(this.modeloMonitorPosicaoZero);
        console.log(this.modelosMonitores);
      },
      (erro) => {
        console.error('Erro ao buscar Modelo Monitor:', erro);
      }
    );
  }

  buscarTopologiaMonitores(): void {
    this.parametrosService?.getTopologiaMonitores().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.topologiasMonitor = dados;
        this.topologiasMonitor.unshift(this.topologiaMonitorPosicaoZero);
        console.log(this.topologiasMonitor);
      },
      (erro) => {
        console.error('Erro ao buscar Topologia Monitores:', erro);
      }
    );
  }

  /////////////////////////

  buscarMarcasBateria(): void {
    this.parametrosService?.getMarcasBaterias().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.marcasBaterais = dados;
        this.marcasBaterais.unshift(this.marcaBateriaPosicaoZero);
        console.log(this.marcasBaterais);
      },
      (erro) => {
        console.error('Erro ao buscar Marca Bateria:', erro);
      }
    );
  }

  // busca as marcas de monitores no parametro para popular o select
  buscarModelosBateria(): void {
    this.parametrosService?.getMOdelosBaterias().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.modelosBateria = dados;
        this.modelosBateria.unshift(this.modeloBateriaPosicaoZero);
        console.log(this.modelosBateria);
      },
      (erro) => {
        console.error('Erro ao buscar Modelo Bateria:', erro);
      }
    );
  }

  buscarTopologiaBateria(): void {
    this.parametrosService?.getTopologiaBaterias().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.topologiasBateria = dados;
        this.topologiasBateria.unshift(this.topologiaBateriaPosicaoZero);
        console.log(this.topologiasBateria);
      },
      (erro) => {
        console.error('Erro ao buscar Topologia Bateria:', erro);
      }
    );
  }

  ///////////////////////////
  buscarMarcasEstabilizador(): void {
    this.parametrosService?.getMarcasEstabilizadores().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.marcasEstabilizador = dados;
        this.marcasEstabilizador.unshift(this.marcaEstabilizadorPosicaoZero);
        console.log(this.marcasEstabilizador);
      },
      (erro) => {
        console.error('Erro ao buscar Marca Estabilizador:', erro);
      }
    );
  }

  // busca as marcas de monitores no parametro para popular o select
  buscarModelosEstabilizador(): void {
    this.parametrosService?.getMOdelosEstabizadores().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.modelosEstabilizador = dados;
        this.modelosEstabilizador.unshift(this.modeloEstabilizadorPosicaoZero);
        console.log(this.modelosEstabilizador);
      },
      (erro) => {
        console.error('Erro ao buscar Modelo Estabilizador:', erro);
      }
    );
  }

  buscarTopologiaEstabilizador(): void {
    this.parametrosService?.getTopologiaEstabilizadores().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.topologiasEstabilizador = dados;
        this.topologiasEstabilizador.unshift(this.topologiaEstabilizadorPosicaoZero);
        console.log(this.topologiasEstabilizador);
      },
      (erro) => {
        console.error('Erro ao buscar Topologia Estabilizador:', erro);
      }
    );
  }
  //////////////////////////
  buscarMarcasAcessorio(): void {
    this.parametrosService?.getMarcasAcessorios().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.marcasAcessorio = dados;
        this.marcasAcessorio.unshift(this.marcaAcessorioPosicaoZero);
        console.log(this.marcasAcessorio);
      },
      (erro) => {
        console.error('Erro ao buscar Marca Acessorio:', erro);
      }
    );
  }

  // busca as marcas de monitores no parametro para popular o select
  buscarModelosAcessorio(): void {
    this.parametrosService?.getMOdelosAcessorios().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.modelosAcessorio = dados;
        this.modelosAcessorio.unshift(this.modeloAcessorioPosicaoZero);
        console.log(this.modelosAcessorio);
      },
      (erro) => {
        console.error('Erro ao buscar Modelo Acessorio:', erro);
      }
    );
  }

  buscarTopologiaAcessorio(): void {
    this.parametrosService?.getTopologiaAcessorios().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.topologiasAcessorio = dados;
        this.topologiasAcessorio.unshift(this.topologiaAcessorioPosicaoZero);
        console.log(this.topologiasAcessorio);
      },
      (erro) => {
        console.error('Erro ao buscar Topologia Acessorio:', erro);
      }
    );
  }

  ////////////////////////


  buscarCor(): void {
    this.parametrosService?.getCores().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.cores = dados;
        this.cores.unshift(this.corPosicaoZero);
        console.log(this.cores);
      },
      (erro) => {
        console.error('Erro ao buscar Equipamentos:', erro);
      }
    );
  }

  buscarDefeitosCliente(): void {
    this.parametrosService?.getDefeitos().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.defeitosCliente = dados;
        this.defeitosCliente.unshift(this.defeitoClientePosicaoZero);
        console.log(this.defeitosCliente);
      },
      (erro) => {
        console.error('Erro ao buscar Equipamentos:', erro);
      }
    );
  }

  buscarAtendente(): void {
    this.parametrosService?.getAtendentes().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.atendentes = dados;
        this.atendentes.unshift(this.atendenteClientePosicaoZero);
        console.log(this.defeitosCliente);
      },
      (erro) => {
        console.error('Erro ao buscar Equipamentos:', erro);
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
  onClienteInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;

    if (input.length === 4) { // Dispara a busca ao digitar 4 algarismos
      const id = parseInt(input, 10); // Converte o valor para número
      this.getCliente(id); // Chama o método getCliente com o valor digitado
    }
  }

  //escuta o input id
  onClienteKey(event: KeyboardEvent): void {
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


  buscaUltimaOs( ): void {
    this.servico?.ultimaOs().subscribe({
      next: (retorno: number) => {
        this.ultimaOs = retorno;
        console.log("Este é a última os " + this.ultimaOs);
        
        this.novaOs = this.ultimaOs + 1;
        
      },
      error: (err) => {
        console.error('Erro ao buscar o último cliente:', err);
        alert('Ocorreu um erro durante a busca do código do novo cliente. O Novo cliente NÃO foi cadastrado');
      }
    });
  }

  geraObjetoOs() {
    // capturar data e hora formatadas
    const agora = new Date();

// Formata a data no formato ISO 8601 "YYYY-MM-DDTHH:mm:ss"
const ano = agora.getFullYear();
const mes = String(agora.getMonth() + 1).padStart(2, '0');
const dia = String(agora.getDate()).padStart(2, '0');
const horas = String(agora.getHours()).padStart(2, '0');
const minutos = String(agora.getMinutes()).padStart(2, '0');
const segundos = String(agora.getSeconds()).padStart(2, '0');

// Gera o valor final no formato ISO 8601
const dataFormatada = `${ano}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;


    //buscar ultima OS
    this.buscaUltimaOs();

  
    this.os = {
      os: this.novaOs || 0,
      data: dataFormatada,
      hora: `${horas}:${minutos}:${segundos}`,
      fantasia: this.formulario.value.fantasia || "",
      rzsocial: this.formulario.value.rzsocial || "",
      codcli: this.formulario.value.codcli || "",
      atendente: this.atendenteSelecionado || "",
      status: 'ABERTA',
      prioridade: this.formulario.value.prioridade || "",
      equipamento: this.equipamentoSelecionado || "",
      marca: this.marcaSelecionada || "",
      modelo: this.modeloSelecionada || "",
      topologia: this.topologiaSelecionada || "",
      cor: this.corSelecionada || "",
      serial: this.formulario.value.serial || "",
      patrimonio: this.formulario.value.patrimonio || "",
      obs1: this.formulario.value.obs1 || "",
      obs2: this.formulario.value.obs2 || "",
      defeito1: this.defeitoCliente1Selecionado || "",
      defeito2: this.defeitoCliente2Selecionado || "",
      defeito3: "",
      tarefa1: this.formulario.value.tarefa1 || "",
      tarefa2: this.formulario.value.tarefa2 || "",
      tarefa3: this.formulario.value.tarefa3 || "",
      baterias: this.formulario.value.baterias || "",
      material2: this.formulario.value.material2 || "",
      material3: this.formulario.value.material3 || "",
      outrositens: this.formulario.value.outrositens || "",
      qt1: this.formulario.value.qt1 || "0",
      qt2: this.formulario.value.qt2 || "0",
      qt3: this.formulario.value.qt3 || "0",
      qtoutrositens: this.formulario.value.qtoutrositens || "0",
      qtdeslocamento: this.formulario.value.qtdeslocamento || "0",
      valorunit1: this.formulario.value.valorunit1 || "0.00",
      valorunit2: this.formulario.value.valorunit2 || "0.00",
      valorunit3: this.formulario.value.valorunit3 || "0.00",
      valorunitoutrositens: this.formulario.value.valorunitoutrositens || "0.00",
      valorunitariodeslocamento: this.formulario.value.valorunitariodeslocamento || "0.00",
      valortotal1: this.formulario.value.valortotal1 || "0.00",
      valortotal2: this.formulario.value.valortotal2 || "0.00",
      valortotal3: this.formulario.value.valortotal3 || "0.00",
      valortotaloutrositens: this.formulario.value.valortotaloutrositens || "0.00",
      valortotaldeslocamento: this.formulario.value.valortotaldeslocamento || "0.00",
      valorassistencia: this.formulario.value.valorassistencia || "0.00",
      totalbruto: this.formulario.value.totalbruto || "0.00",
      valordesconto: this.formulario.value.valordesconto || "0.00",
      desconto: this.formulario.value.desconto || "0",
      totaliq: this.formulario.value.totaliq || "0.00",
      fechamento: this.formulario.value.fechamento!,
      tecnico: this.formulario.value.tecnico || "",
      garantia: this.garantiaSelecionada || "",
      dataorca: this.formulario.value.dataorca!,
      osoriginal: this.formulario.value.osoriginal || "",
      venda: this.vendaSelecionada || "",
      modelofake: this.formulario.value.modelofake || "",
      obs3: this.formulario.value.obs3 || "",
      jaimp: this.formulario.value.jaimp || "",
      top10: 0,
      dataretro: this.formulario.value.dataretro || ""
    };
  
    console.log("Ordem Serviço a ser cadastrada:", this.os);
    this.exibirNumeroNovaOs = true;
    this.exibirBotaoSalvar = true;
    this.exibirBotaoSair = true;
  }
  

  escreveDadosClienteNosInputs(cliente: Cliente): void {
    console.log('Dados do cliente:', cliente);
        this.formulario.patchValue({
            codcli: cliente.id, 
            fantasia: cliente.nomefantasia,
            rzsocial: cliente.razaosocial,
        });

        console.log("Este é o cpf do cliente " + cliente.cpfcnpj)
        if(!cliente.cpfcnpj || cliente.cpfcnpj.length < 11){
          alert(" Atenção!!! Cliente sem CPF ou CNPJ cadastrados")
        }
        this.exibirBotaoImprimeOutrasOs = false;
        

    setTimeout(() => {  // aguarda 1 segundo para fechar a tabela
      this.exibirTabela = false;
      this.cdr.detectChanges(); // Força a atualização da visualização imediatamente
    }, 500);

  }

  enviarOs(): void {
    // Valida apenas campos obrigatórios
    let hasInvalidFields = false;

    Object.keys(this.formulario.controls).forEach((campo) => {
        const controle = this.formulario.get(campo);
        // Verifique apenas os controles com o validador 'required'
        if (controle?.hasValidator(Validators.required) && controle.invalid) {
            controle.markAsTouched();
            hasInvalidFields = true;
        }
    });

    if (hasInvalidFields) {
      this.exibirAlertValidacao = true;
        return; // Interrompe a execução se houver campos obrigatórios inválidos
    }

    this.geraObjetoOs();
    this.exibirBotaoSalvar = false;
    this.exibirBotaoImprimir = true;

    // Chama o serviço para cadastrar a OS somente se os campos obrigatórios forem válidos
    this.servico.cadastrarOs(this.os).subscribe({
        next: (response) => {
            console.log('Ordem de Serviço cadastrada com sucesso:', response);
            this.textoOscadastradaSucesso = true
        },
        error: (error) => {
            console.error('Erro ao cadastrar Ordem de Serviço:', error);
            alert('Erro ao cadastrar Ordem de Serviço. Tente novamente.');
        }
    });
}

gerarPDF() {
  this.exibirComprovante = true;

  // Espera 1 segundo antes de continuar com o restante do código
  setTimeout(() => {
    const element = document.getElementById('pdf-content'); // Seleciona o conteúdo do HTML
    
    if (element) {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Define as dimensões e posição da imagem no PDF
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

        // Gera o PDF como Blob e cria uma URL para abrir em uma nova aba
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Abre o PDF em uma nova aba
        window.open(pdfUrl);

        // Libera a URL temporária após um tempo
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);

        this.exibirComprovante = false;
      });
    } else {
      console.error('Elemento para gerar o PDF não encontrado.');
    }
  }, 500); // Espera de 1 segundo
}

limpar() {
  // Navega para a primeira rota
  this.router.navigate(['/home']).then(() => {
    // Após a navegação para 'home', navega para 'parametros'
    this.router.navigate(['os/cadastro']);
  });
}

///////// IMPRIMIR O FORMULÁRIO DE ENTRADA PARA QUALQUER ORDEMM DE SERVIÇO:

imprimeAlgumComprovante(): void {
  event.preventDefault(); // Previne o submit do formulário
  this.exibirInputsMarcaModeloTopologiaAoImprir=true;
  const input = window.prompt('Digite um número:');
  if (input !== null) {
    const valorNumerico = Number(input);
    if (!isNaN(valorNumerico)) {
      this.osParaImprimir = valorNumerico;
      console.log(" este é o num da os digitado para impressão: " + this.osParaImprimir)
      this.getOsPorId(this.osParaImprimir);
    } else {
      alert('Por favor, insira um número válido.');
    }
  }
}

// Busca ORDEM SERVIÇO por id
getOsPorId(id: number): void {
  this.servico.getOsPorId(id).subscribe(
    (data: Os) => {
      this.objetoOs = [data]; // Coloca o cliente dentro de um array
      console.log('Os que terá o comprovante impresso ', this.objetoOs);
      this.escreveNosImputsParaImprimirQualquerOs(this.objetoOs);
      
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

escreveNosImputsParaImprimirQualquerOs(objetoOs: any): void {
  console.log('Dados da os que serão inscritos nos inputs', objetoOs[0]);
      this.formulario.patchValue({
          codcli: objetoOs[0].codcli, 
          fantasia: objetoOs[0].fantasia,
          rzsocial: objetoOs[0].razaosocial,
          equipamento: objetoOs[0].equipamento,
          marca: objetoOs[0].marca,
          modelo: objetoOs[0].modelo,
          topologia: objetoOs[0].topologia,
          cor: objetoOs[0].cor,
          serial: objetoOs[0].serial,
          patrimonio: objetoOs[0].patrimonio,
          obs1: objetoOs[0].obs1,
          obs2: objetoOs[0].obs2,
          defeito1:objetoOs[0].defeito1,
          defeito2:objetoOs[0].defeito2,
          venda: objetoOs[0].venda,
          garantia: objetoOs[0].garantia,
          osoriginal: objetoOs[0].osoriginal,
          atendente: objetoOs[0].atendente,
      });

      this.exibirBotaoImprimir = true;
}
}
