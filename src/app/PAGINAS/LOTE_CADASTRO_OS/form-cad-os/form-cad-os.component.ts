import { ChangeDetectorRef, Component } from '@angular/core';
import { ParametrosCombobox } from '../../../modelo/ParametrosCombobox';
import { Cliente } from '../../../modelo/Cliente';
import { Os } from '../../../modelo/Os';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParametrosService } from '../../../servico/parametros.service';
import { OrdemservicoService } from '../../../servico/ordemservico.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import QRCode from 'qrcode';



@Component({
  selector: 'app-form-cad-os',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-cad-os.component.html',
  styleUrl: './form-cad-os.component.css'
})
export class FORMCADOSComponent{

  cidades: ParametrosCombobox[] = [];
  cidadeSelecionada: string = "";
  cidadesPosicaoZero: any = { id: 100, parametro: 'SEGMENTO', valor: 'CIDADES' }; // para não iniciar com um nome de cidade e sim "cidades"

  equipamentos: ParametrosCombobox[] = [];
  equipamentoSelecionado: string = "";
  equipamentoSelecionado1: string = "";
  equipamentoSelecionado2: string = "";
  equipamentoSelecionado3: string = "";
  equipamentoSelecionado4: string = "";
  equipamentoSelecionado5: string = "";
  equipamentoSelecionado6: string = "";
  equipamentoSelecionado7: string = "";
  equipamentoSelecionado8: string = "";
  equipamentoSelecionado9: string = "";
  equipamentoSelecionado10: string = "";
  equipamentoSelecionado11: string = "";
  equipamentoSelecionado12: string = "";
  equipamentoSelecionado13: string = "";
  equipamentoSelecionado14: string = "";
  equipamentoSelecionado15: string = "";
  equipamentoSelecionado16: string = "";
  equipamentoSelecionado17: string = "";
  equipamentoSelecionado18: string = "";
  equipamentoSelecionado19: string = "";
  equipamentoSelecionado20: string = "";
  equipamentosPosicaoZero: any = { id: 100, parametro: 'EQUIPAMENTO', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  marcasNobreaks: ParametrosCombobox[] = [];
  marcaSelecionada: string = "";
  marcaSelecionada1: string = "";
  marcaSelecionada2: string = "";
  marcaSelecionada3: string = "";
  marcaSelecionada4: string = "";
  marcaSelecionada5: string = "";
  marcaSelecionada6: string = "";
  marcaSelecionada7: string = "";
  marcaSelecionada8: string = "";
  marcaSelecionada9: string = "";
  marcaSelecionada10: string = "";
  marcaSelecionada11: string = "";
  marcaSelecionada12: string = "";
  marcaSelecionada13: string = "";
  marcaSelecionada14: string = "";
  marcaSelecionada15: string = "";
  marcaSelecionada16: string = "";
  marcaSelecionada17: string = "";
  marcaSelecionada18: string = "";
  marcaSelecionada19: string = "";
  marcaSelecionada20: string = "";
  marcaNobreakPosicaoZero: any = { id: 100, parametro: 'MARCANOBREAK', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  modelosNobreaks: ParametrosCombobox[] = [];
  modeloSelecionada: string = "";
  modeloSelecionada1: string = "";
  modeloSelecionada2: string = "";
  modeloSelecionada3: string = "";
  modeloSelecionada4: string = "";
  modeloSelecionada5: string = "";
  modeloSelecionada6: string = "";
  modeloSelecionada7: string = "";
  modeloSelecionada8: string = "";
  modeloSelecionada9: string = "";
  modeloSelecionada10: string = "";
  modeloSelecionada11: string = "";
  modeloSelecionada12: string = "";
  modeloSelecionada13: string = "";
  modeloSelecionada14: string = "";
  modeloSelecionada15: string = "";
  modeloSelecionada16: string = "";
  modeloSelecionada17: string = "";
  modeloSelecionada18: string = "";
  modeloSelecionada19: string = "";
  modeloSelecionada20: string = "";
  modeloNobreakPosicaoZero: any = { id: 100, parametro: 'MODELONOBREAK', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  garantiaSelecionada: string = "NÃO";
  garantiaSelecionada1: string = "NÃO";
  garantiaSelecionada2: string = "NÃO";
  garantiaSelecionada3: string = "NÃO";
  garantiaSelecionada4: string = "NÃO";
  garantiaSelecionada5: string = "NÃO";
  garantiaSelecionada6: string = "NÃO";
  garantiaSelecionada7: string = "NÃO";
  garantiaSelecionada8: string = "NÃO";
  garantiaSelecionada9: string = "NÃO";
  garantiaSelecionada10: string = "NÃO";
  garantiaSelecionada11: string = "NÃO";
  garantiaSelecionada12: string = "NÃO";
  garantiaSelecionada13: string = "NÃO";
  garantiaSelecionada14: string = "NÃO";
  garantiaSelecionada15: string = "NÃO";
  garantiaSelecionada16: string = "NÃO";
  garantiaSelecionada17: string = "NÃO";
  garantiaSelecionada18: string = "NÃO";
  garantiaSelecionada19: string = "NÃO";
  garantiaSelecionada20: string = "NÃO";

  os1: string = "";
  os2: string = "";
  os3: string = "";
  os4: string = "";
  os5: string = "";
  os6: string = "";
  os7: string = "";
  os8: string = "";
  os9: string = "";
  os10: string = "";
  os11: string = "";
  os12: string = "";
  os13: string = "";
  os14: string = "";
  os15: string = "";
  os16: string = "";
  os17: string = "";
  os18: string = "";
  os19: string = "";
  os20: string = "";

  serial1: string = "";
  serial2: string = "";
  serial3: string = "";
  serial4: string = "";
  serial5: string = "";
  serial6: string = "";
  serial7: string = "";
  serial8: string = "";
  serial9: string = "";
  serial10: string = "";
  serial11: string = "";
  serial12: string = "";
  serial13: string = "";
  serial14: string = "";
  serial15: string = "";
  serial16: string = "";
  serial17: string = "";
  serial18: string = "";
  serial19: string = "";
  serial20: string = "";

  patrimonio1: string = "";
  patrimonio2: string = "";
  patrimonio3: string = "";
  patrimonio4: string = "";
  patrimonio5: string = "";
  patrimonio6: string = "";
  patrimonio7: string = "";
  patrimonio8: string = "";
  patrimonio9: string = "";
  patrimonio10: string = "";
  patrimonio11: string = "";
  patrimonio12: string = "";
  patrimonio13: string = "";
  patrimonio14: string = "";
  patrimonio15: string = "";
  patrimonio16: string = "";
  patrimonio17: string = "";
  patrimonio18: string = "";
  patrimonio19: string = "";
  patrimonio20: string = "";


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

  cliente: Cliente = new Cliente();
  os: Os = new Os();
  novocliente: number = 0;
  ultimoCliente: number = 0;
  objetocliente: Cliente[] = [];
  ultimaOs: number = 0;
  novaOs: number = 0;
  urlQrcod: string = 'https://app.somonitores.tec.br/';
  qrCodeUrl: string = '';

  os$ = new BehaviorSubject<any | null>(null); // Inicialize como `null`

  private lock: boolean = false; // Adiciona uma variável de bloqueio

  marcasDisponiveis: { valor: string }[] = [];

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
  exibirEntrada1: boolean = false;
  exibirEntrada2: boolean = false;
  exibirEntrada3: boolean = false;
  exibirEntrada4: boolean = false;
  exibirEntrada5: boolean = false;
  exibirEntrada6: boolean = false;
  exibirEntrada7: boolean = false;
  exibirEntrada8: boolean = false;
  exibirEntrada9: boolean = false;
  exibirEntrada10: boolean = false;
  exibirEntrada11: boolean = false;
  exibirEntrada12: boolean = false;
  exibirEntrada13: boolean = false;
  exibirEntrada14: boolean = false;
  exibirEntrada15: boolean = false;
  exibirEntrada16: boolean = false;
  exibirEntrada17: boolean = false;
  exibirEntrada18: boolean = false;
  exibirEntrada19: boolean = false;
  exibirEntrada20: boolean = false;

  exibirListaMarcas1: boolean = true;
  exibirSoUmaMarca1: boolean = false;

  exibirListaMarcas2: boolean = true;
  exibirSoUmaMarca2: boolean = false;

  exibirListaMarcas3: boolean = true;
  exibirSoUmaMarca3: boolean = false;

  exibirListaMarcas4: boolean = true;
  exibirSoUmaMarca4: boolean = false;

  exibirListaMarcas5: boolean = true;
  exibirSoUmaMarca5: boolean = false;

  exibirListaMarcas6: boolean = true;
  exibirSoUmaMarca6: boolean = false;

  exibirListaMarcas7: boolean = true;
  exibirSoUmaMarca7: boolean = false;

  exibirListaMarcas8: boolean = true;
  exibirSoUmaMarca8: boolean = false;

  exibirListaMarcas9: boolean = true;
  exibirSoUmaMarca9: boolean = false;

  exibirListaMarcas10: boolean = true;
  exibirSoUmaMarca10: boolean = false;

  exibirListaMarcas11: boolean = true;
  exibirSoUmaMarca11: boolean = false;

  exibirListaMarcas12: boolean = true;
  exibirSoUmaMarca12: boolean = false;

  exibirListaMarcas13: boolean = true;
  exibirSoUmaMarca13: boolean = false;

  exibirListaMarcas14: boolean = true;
  exibirSoUmaMarca14: boolean = false;

  exibirListaMarcas15: boolean = true;
  exibirSoUmaMarca15: boolean = false;

  exibirListaMarcas16: boolean = true;
  exibirSoUmaMarca16: boolean = false;

  exibirListaMarcas17: boolean = true;
  exibirSoUmaMarca17: boolean = false;

  exibirListaMarcas18: boolean = true;
  exibirSoUmaMarca18: boolean = false;

  exibirListaMarcas19: boolean = true;
  exibirSoUmaMarca19: boolean = false;

  exibirListaMarcas20: boolean = true;
  exibirSoUmaMarca20: boolean = false;


  exibirListaModelo1: boolean = true;
  exibirSoUmModelo1: boolean = false;

  exibirListaModelo2: boolean = true;
  exibirSoUmModelo2: boolean = false;

  exibirListaModelo3: boolean = true;
  exibirSoUmModelo3: boolean = false;

  exibirListaModelo4: boolean = true;
  exibirSoUmModelo4: boolean = false;

  exibirListaModelo5: boolean = true;
  exibirSoUmModelo5: boolean = false;

  exibirListaModelo6: boolean = true;
  exibirSoUmModelo6: boolean = false;

  exibirListaModelo7: boolean = true;
  exibirSoUmModelo7: boolean = false;

  exibirListaModelo8: boolean = true;
  exibirSoUmModelo8: boolean = false;

  exibirListaModelo9: boolean = true;
  exibirSoUmModelo9: boolean = false;

  exibirListaModelo10: boolean = true;
  exibirSoUmModelo10: boolean = false;

  exibirListaModelo11: boolean = true;
  exibirSoUmModelo11: boolean = false;

  exibirListaModelo12: boolean = true;
  exibirSoUmModelo12: boolean = false;

  exibirListaModelo13: boolean = true;
  exibirSoUmModelo13: boolean = false;

  exibirListaModelo14: boolean = true;
  exibirSoUmModelo14: boolean = false;

  exibirListaModelo15: boolean = true;
  exibirSoUmModelo15: boolean = false;

  exibirListaModelo16: boolean = true;
  exibirSoUmModelo16: boolean = false;

  exibirListaModelo17: boolean = true;
  exibirSoUmModelo17: boolean = false;

  exibirListaModelo18: boolean = true;
  exibirSoUmModelo18: boolean = false;

  exibirListaModelo19: boolean = true;
  exibirSoUmModelo19: boolean = false;

  exibirListaModelo20: boolean = true;
  exibirSoUmModelo20: boolean = false;

  exibirOs1: boolean = false;
  exibirOs2: boolean = false;
  exibirOs3: boolean = false;
  exibirOs4: boolean = false;
  exibirOs5: boolean = false;
  exibirOs6: boolean = false;
  exibirOs7: boolean = false;
  exibirOs8: boolean = false;
  exibirOs9: boolean = false;
  exibirOs10: boolean = false;
  exibirOs11: boolean = false;
  exibirOs12: boolean = false;
  exibirOs13: boolean = false;
  exibirOs14: boolean = false;
  exibirOs15: boolean = false;
  exibirOs16: boolean = false;
  exibirOs17: boolean = false;
  exibirOs18: boolean = false;
  exibirOs19: boolean = false;
  exibirOs20: boolean = false;



  nobreak: boolean =false;
  monitor: boolean=false;
  bateria: boolean=false;
  estabilizador: boolean=false;
  acessorios: boolean = false;
  contadorEquipamento: number = 0;

  

  // CONFIGURA FORMULÁRIO
  formulario = new FormGroup({
    os1:new FormControl(''),
    os2:new FormControl(''),
    os3:new FormControl(''),
    os4:new FormControl(''),
    os5:new FormControl(''),
    os6:new FormControl(''),
    os7:new FormControl(''),
    os8:new FormControl(''),
    os9:new FormControl(''),
    os10:new FormControl(''),
    os11:new FormControl(''),
    os12:new FormControl(''),
    os13:new FormControl(''),
    os14:new FormControl(''),
    os15:new FormControl(''),
    os16:new FormControl(''),
    os17:new FormControl(''),
    os18:new FormControl(''),
    os19:new FormControl(''),
    os20:new FormControl(''),
    fantasia:new FormControl(''),
    rzsocial:new FormControl(''),
    codcli:new FormControl('', Validators.required),
    atendente:new FormControl('', Validators.required),
    equipamento1:new FormControl(''),
    equipamento2:new FormControl(''),
    equipamento3:new FormControl(''),
    equipamento4:new FormControl(''),
    equipamento5:new FormControl(''),
    equipamento6:new FormControl(''),
    equipamento7:new FormControl(''),
    equipamento8:new FormControl(''),
    equipamento9:new FormControl(''),
    equipamento10:new FormControl(''),
    equipamento11:new FormControl(''),
    equipamento12:new FormControl(''),
    equipamento13:new FormControl(''),
    equipamento14:new FormControl(''),
    equipamento15:new FormControl(''),
    equipamento16:new FormControl(''),
    equipamento17:new FormControl(''),
    equipamento18:new FormControl(''),
    equipamento19:new FormControl(''),
    equipamento20:new FormControl(''),
    marca1:new FormControl(''),
    marca2:new FormControl(''),
    marca3:new FormControl(''),
    marca4:new FormControl(''),
    marca5:new FormControl(''),
    marca6:new FormControl(''),
    marca7:new FormControl(''),
    marca8:new FormControl(''),
    marca9:new FormControl(''),
    marca10:new FormControl(''),
    marca11:new FormControl(''),
    marca12:new FormControl(''),
    marca13:new FormControl(''),
    marca14:new FormControl(''),
    marca15:new FormControl(''),
    marca16:new FormControl(''),
    marca17:new FormControl(''),
    marca18:new FormControl(''),
    marca19:new FormControl(''),
    marca20:new FormControl(''),
    modelo1:new FormControl(''),
    modelo2:new FormControl(''),
    modelo3:new FormControl(''),
    modelo4:new FormControl(''),
    modelo5:new FormControl(''),
    modelo6:new FormControl(''),
    modelo7:new FormControl(''),
    modelo8:new FormControl(''),
    modelo9:new FormControl(''),
    modelo10:new FormControl(''),
    modelo11:new FormControl(''),
    modelo12:new FormControl(''),
    modelo13:new FormControl(''),
    modelo14:new FormControl(''),
    modelo15:new FormControl(''),
    modelo16:new FormControl(''),
    modelo17:new FormControl(''),
    modelo18:new FormControl(''),
    modelo19:new FormControl(''),
    modelo20:new FormControl(''),
    serial1:new FormControl(''),
    serial2:new FormControl(''),
    serial3:new FormControl(''),
    serial4:new FormControl(''),
    serial5:new FormControl(''),
    serial6:new FormControl(''),
    serial7:new FormControl(''),
    serial8:new FormControl(''),
    serial9:new FormControl(''),
    serial10:new FormControl(''),
    serial11:new FormControl(''),
    serial12:new FormControl(''),
    serial13:new FormControl(''),
    serial14:new FormControl(''),
    serial15:new FormControl(''),
    serial16:new FormControl(''),
    serial17:new FormControl(''),
    serial18:new FormControl(''),
    serial19:new FormControl(''),
    serial20:new FormControl(''),
    patrimonio1:new FormControl(''),
    patrimonio2:new FormControl(''),
    patrimonio3:new FormControl(''),
    patrimonio4:new FormControl(''),
    patrimonio5:new FormControl(''),
    patrimonio6:new FormControl(''),
    patrimonio7:new FormControl(''),
    patrimonio8:new FormControl(''),
    patrimonio9:new FormControl(''),
    patrimonio10:new FormControl(''),
    patrimonio11:new FormControl(''),
    patrimonio12:new FormControl(''),
    patrimonio13:new FormControl(''),
    patrimonio14:new FormControl(''),
    patrimonio15:new FormControl(''),
    patrimonio16:new FormControl(''),
    patrimonio17:new FormControl(''),
    patrimonio18:new FormControl(''),
    patrimonio19:new FormControl(''),
    patrimonio20:new FormControl(''),
    garantia1:new FormControl('NÃO'),
    garantia2:new FormControl('NÃO'),
    garantia3:new FormControl('NÃO'),
    garantia4:new FormControl('NÃO'),
    garantia5:new FormControl('NÃO'),
    garantia6:new FormControl('NÃO'),
    garantia7:new FormControl('NÃO'),
    garantia8:new FormControl('NÃO'),
    garantia9:new FormControl('NÃO'),
    garantia10:new FormControl('NÃO'),
    garantia11:new FormControl('NÃO'),
    garantia12:new FormControl('NÃO'),
    garantia13:new FormControl('NÃO'),
    garantia14:new FormControl('NÃO'),
    garantia15:new FormControl('NÃO'),
    garantia16:new FormControl('NÃO'),
    garantia17:new FormControl('NÃO'),
    garantia18:new FormControl('NÃO'),
    garantia19:new FormControl('NÃO'),
    garantia20:new FormControl('NÃO'),
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

// ESCUTA Os SELECTs EQUIPAMENTOS////////////////////////////
onEquipamentoChange1(event: Event): void {
  this.equipamentoSelecionado1 = (event.target as HTMLSelectElement).value;
  this.equipamentoSelecionado = this.equipamentoSelecionado1;
  console.log(this.equipamentoSelecionado);
  this.carregaMarcas();
}

onEquipamentoChange2(event: Event): void {
  this.equipamentoSelecionado2 = (event.target as HTMLSelectElement).value;
  this.equipamentoSelecionado = this.equipamentoSelecionado2;
  console.log(this.equipamentoSelecionado);
  this.carregaMarcas();
}

onEquipamentoChange3(event: Event): void {
  this.equipamentoSelecionado3 = (event.target as HTMLSelectElement).value;
  this.equipamentoSelecionado = this.equipamentoSelecionado3;
  console.log(this.equipamentoSelecionado);
  this.carregaMarcas();
}

onEquipamentoChange4(event: Event): void {
  this.equipamentoSelecionado4 = (event.target as HTMLSelectElement).value;
  this.equipamentoSelecionado = this.equipamentoSelecionado4;
  console.log(this.equipamentoSelecionado);
  this.carregaMarcas();
}

onEquipamentoChange5(event: Event): void {
  this.equipamentoSelecionado5 = (event.target as HTMLSelectElement).value;
  this.equipamentoSelecionado = this.equipamentoSelecionado5;
  console.log(this.equipamentoSelecionado);
  this.carregaMarcas();
}

onEquipamentoChange6(event: Event): void {
  this.equipamentoSelecionado6 = (event.target as HTMLSelectElement).value;
  this.equipamentoSelecionado = this.equipamentoSelecionado6;
  console.log(this.equipamentoSelecionado);
  this.carregaMarcas();
}

onEquipamentoChange7(event: Event): void {
  this.equipamentoSelecionado7 = (event.target as HTMLSelectElement).value;
  this.equipamentoSelecionado = this.equipamentoSelecionado7;
  console.log(this.equipamentoSelecionado);
  this.carregaMarcas();
}

onEquipamentoChange8(event: Event): void {
  this.equipamentoSelecionado8 = (event.target as HTMLSelectElement).value;
  this.equipamentoSelecionado = this.equipamentoSelecionado8;
  console.log(this.equipamentoSelecionado);
  this.carregaMarcas();
}

onEquipamentoChange9(event: Event): void {
  this.equipamentoSelecionado9 = (event.target as HTMLSelectElement).value;
  this.equipamentoSelecionado = this.equipamentoSelecionado9;
  console.log(this.equipamentoSelecionado);
  this.carregaMarcas();
}

onEquipamentoChange10(event: Event): void {
  this.equipamentoSelecionado10 = (event.target as HTMLSelectElement).value;
  this.equipamentoSelecionado = this.equipamentoSelecionado10;
  console.log(this.equipamentoSelecionado);
  this.carregaMarcas();
}

onEquipamentoChange11(event: Event): void {
  this.equipamentoSelecionado11 = (event.target as HTMLSelectElement).value;
  this.equipamentoSelecionado = this.equipamentoSelecionado11;
  console.log(this.equipamentoSelecionado);
  this.carregaMarcas();
}

onEquipamentoChange12(event: Event): void {
  this.equipamentoSelecionado12 = (event.target as HTMLSelectElement).value;
  this.equipamentoSelecionado = this.equipamentoSelecionado12;
  console.log(this.equipamentoSelecionado);
  this.carregaMarcas();
}

onEquipamentoChange13(event: Event): void {
  this.equipamentoSelecionado13 = (event.target as HTMLSelectElement).value;
  this.equipamentoSelecionado = this.equipamentoSelecionado13;
  console.log(this.equipamentoSelecionado);
  this.carregaMarcas();
}

onEquipamentoChange14(event: Event): void {
  this.equipamentoSelecionado14 = (event.target as HTMLSelectElement).value;
  this.equipamentoSelecionado = this.equipamentoSelecionado14;
  console.log(this.equipamentoSelecionado);
  this.carregaMarcas();
}

onEquipamentoChange15(event: Event): void {
  this.equipamentoSelecionado15 = (event.target as HTMLSelectElement).value;
  this.equipamentoSelecionado = this.equipamentoSelecionado15;
  console.log(this.equipamentoSelecionado);
  this.carregaMarcas();
}

onEquipamentoChange16(event: Event): void {
  this.equipamentoSelecionado16 = (event.target as HTMLSelectElement).value;
  this.equipamentoSelecionado = this.equipamentoSelecionado16;
  console.log(this.equipamentoSelecionado);
  this.carregaMarcas();
}

onEquipamentoChange17(event: Event): void {
  this.equipamentoSelecionado17 = (event.target as HTMLSelectElement).value;
  this.equipamentoSelecionado = this.equipamentoSelecionado17;
  console.log(this.equipamentoSelecionado);
  this.carregaMarcas();
}

onEquipamentoChange18(event: Event): void {
  this.equipamentoSelecionado18 = (event.target as HTMLSelectElement).value;
  this.equipamentoSelecionado = this.equipamentoSelecionado18;
  console.log(this.equipamentoSelecionado);
  this.carregaMarcas();
}

onEquipamentoChange19(event: Event): void {
  this.equipamentoSelecionado19 = (event.target as HTMLSelectElement).value;
  this.equipamentoSelecionado = this.equipamentoSelecionado19;
  console.log(this.equipamentoSelecionado);
  this.carregaMarcas();
}

onEquipamentoChange20(event: Event): void {
  this.equipamentoSelecionado20 = (event.target as HTMLSelectElement).value;
  this.equipamentoSelecionado = this.equipamentoSelecionado20;
  console.log(this.equipamentoSelecionado);
  this.carregaMarcas();
}



carregaMarcas(){
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

// ESCUTA Os SELECTs MODELOs//////////////////////////////////////////////////

onModeloChange1(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("modelo1") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.modeloSelecionada1) {
      this.modeloSelecionada1 = newValue;
      this.modeloSelecionada = newValue;
      this.exibirListaModelo1 = false; // Oculta a lista de marcas
      this.exibirSoUmModelo1 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onModeloChange2(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("modelo2") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.modeloSelecionada2) {
      this.modeloSelecionada2 = newValue;
      this.modeloSelecionada = newValue;
      this.exibirListaModelo2 = false; // Oculta a lista de marcas
      this.exibirSoUmModelo2 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onModeloChange3(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("modelo3") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.modeloSelecionada3) {
      this.modeloSelecionada3 = newValue;
      this.modeloSelecionada = newValue;
      this.exibirListaModelo3 = false; // Oculta a lista de marcas
      this.exibirSoUmModelo3 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onModeloChange4(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("modelo4") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.modeloSelecionada4) {
      this.modeloSelecionada4 = newValue;
      this.modeloSelecionada = newValue;
      this.exibirListaModelo4 = false; // Oculta a lista de marcas
      this.exibirSoUmModelo4 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}
onModeloChange5(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("modelo5") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.modeloSelecionada5) {
      this.modeloSelecionada5 = newValue;
      this.modeloSelecionada = newValue;
      this.exibirListaModelo5 = false; // Oculta a lista de marcas
      this.exibirSoUmModelo5 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onModeloChange6(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("modelo6") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.modeloSelecionada6) {
      this.modeloSelecionada6 = newValue;
      this.modeloSelecionada = newValue;
      this.exibirListaModelo6 = false; // Oculta a lista de marcas
      this.exibirSoUmModelo6 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onModeloChange7(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("modelo7") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.modeloSelecionada7) {
      this.modeloSelecionada7 = newValue;
      this.modeloSelecionada = newValue;
      this.exibirListaModelo7 = false; // Oculta a lista de marcas
      this.exibirSoUmModelo7 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}
onModeloChange8(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("modelo8") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.modeloSelecionada8) {
      this.modeloSelecionada8 = newValue;
      this.modeloSelecionada = newValue;
      this.exibirListaModelo8 = false; // Oculta a lista de marcas
      this.exibirSoUmModelo8 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onModeloChange9(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("modelo9") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.modeloSelecionada9) {
      this.modeloSelecionada9 = newValue;
      this.modeloSelecionada = newValue;
      this.exibirListaModelo9 = false; // Oculta a lista de marcas
      this.exibirSoUmModelo9 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onModeloChange10(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("modelo10") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.modeloSelecionada10) {
      this.modeloSelecionada10 = newValue;
      this.modeloSelecionada = newValue;
      this.exibirListaModelo10 = false; // Oculta a lista de marcas
      this.exibirSoUmModelo10 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onModeloChange11(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("modelo10") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.modeloSelecionada11) {
      this.modeloSelecionada11 = newValue;
      this.modeloSelecionada = newValue;
      this.exibirListaModelo11 = false; // Oculta a lista de marcas
      this.exibirSoUmModelo11 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onModeloChange12(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("modelo10") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.modeloSelecionada12) {
      this.modeloSelecionada12 = newValue;
      this.modeloSelecionada = newValue;
      this.exibirListaModelo12 = false; // Oculta a lista de marcas
      this.exibirSoUmModelo12 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onModeloChange13(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("modelo10") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.modeloSelecionada13) {
      this.modeloSelecionada13 = newValue;
      this.modeloSelecionada = newValue;
      this.exibirListaModelo13 = false; // Oculta a lista de marcas
      this.exibirSoUmModelo13 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onModeloChange14(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("modelo10") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.modeloSelecionada14) {
      this.modeloSelecionada14 = newValue;
      this.modeloSelecionada = newValue;
      this.exibirListaModelo14 = false; // Oculta a lista de marcas
      this.exibirSoUmModelo14 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onModeloChange15(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("modelo10") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.modeloSelecionada15) {
      this.modeloSelecionada15 = newValue;
      this.modeloSelecionada = newValue;
      this.exibirListaModelo15 = false; // Oculta a lista de marcas
      this.exibirSoUmModelo15 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onModeloChange16(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("modelo10") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.modeloSelecionada16) {
      this.modeloSelecionada16 = newValue;
      this.modeloSelecionada = newValue;
      this.exibirListaModelo16 = false; // Oculta a lista de marcas
      this.exibirSoUmModelo16 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onModeloChange17(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("modelo10") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.modeloSelecionada17) {
      this.modeloSelecionada17 = newValue;
      this.modeloSelecionada = newValue;
      this.exibirListaModelo17 = false; // Oculta a lista de marcas
      this.exibirSoUmModelo17 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onModeloChange18(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("modelo10") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.modeloSelecionada18) {
      this.modeloSelecionada18 = newValue;
      this.modeloSelecionada = newValue;
      this.exibirListaModelo18 = false; // Oculta a lista de marcas
      this.exibirSoUmModelo18 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onModeloChange19(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("modelo10") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.modeloSelecionada19) {
      this.modeloSelecionada19 = newValue;
      this.modeloSelecionada = newValue;
      this.exibirListaModelo19 = false; // Oculta a lista de marcas
      this.exibirSoUmModelo19 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onModeloChange20(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("modelo10") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.modeloSelecionada20) {
      this.modeloSelecionada20 = newValue;
      this.modeloSelecionada = newValue;
      this.exibirListaModelo20 = false; // Oculta a lista de marcas
      this.exibirSoUmModelo20 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}


carregaModelos(){
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

// ESCUTA Os SELECTs MARCAs/////////////////////////////////////////////////////
// Método para lidar com a mudança de marca

onMarcaChange1(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("marca1") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.marcaSelecionada1) {
      this.marcaSelecionada1 = newValue;
      this.marcaSelecionada = newValue;
      this.exibirListaMarcas1 = false; // Oculta a lista de marcas
      this.exibirSoUmaMarca1 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}
onMarcaChange2(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("marca2") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.marcaSelecionada2) {
      this.marcaSelecionada2 = newValue;
      this.marcaSelecionada = newValue;
      this.exibirListaMarcas2 = false; // Oculta a lista de marcas
      this.exibirSoUmaMarca2 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onMarcaChange3(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("marca3") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.marcaSelecionada3) {
      this.marcaSelecionada3 = newValue;
      this.marcaSelecionada = newValue;
      this.exibirListaMarcas3 = false; // Oculta a lista de marcas
      this.exibirSoUmaMarca3 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onMarcaChange4(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("marca4") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.marcaSelecionada4) {
      this.marcaSelecionada4 = newValue;
      this.marcaSelecionada = newValue;
      this.exibirListaMarcas4 = false; // Oculta a lista de marcas
      this.exibirSoUmaMarca4 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onMarcaChange5(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("marca5") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.marcaSelecionada5) {
      this.marcaSelecionada5 = newValue;
      this.marcaSelecionada = newValue;
      this.exibirListaMarcas5 = false; // Oculta a lista de marcas
      this.exibirSoUmaMarca5 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}
onMarcaChange6(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("marca6") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.marcaSelecionada6) {
      this.marcaSelecionada6 = newValue;
      this.marcaSelecionada = newValue;
      this.exibirListaMarcas6 = false; // Oculta a lista de marcas
      this.exibirSoUmaMarca6 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}
onMarcaChange7(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("marca7") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.marcaSelecionada7) {
      this.marcaSelecionada7 = newValue;
      this.marcaSelecionada = newValue;
      this.exibirListaMarcas7 = false; // Oculta a lista de marcas
      this.exibirSoUmaMarca7 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onMarcaChange8(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("marca8") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.marcaSelecionada8) {
      this.marcaSelecionada8 = newValue;
      this.marcaSelecionada = newValue;
      this.exibirListaMarcas8 = false; // Oculta a lista de marcas
      this.exibirSoUmaMarca8 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onMarcaChange9(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("marca9") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.marcaSelecionada9) {
      this.marcaSelecionada9 = newValue;
      this.marcaSelecionada = newValue;
      this.exibirListaMarcas9 = false; // Oculta a lista de marcas
      this.exibirSoUmaMarca9 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onMarcaChange10(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("marca10") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.marcaSelecionada10) {
      this.marcaSelecionada10 = newValue;
      this.marcaSelecionada = newValue;
      this.exibirListaMarcas10 = false; // Oculta a lista de marcas
      this.exibirSoUmaMarca10 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onMarcaChange11(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("marca11") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.marcaSelecionada11) {
      this.marcaSelecionada11 = newValue;
      this.marcaSelecionada = newValue;
      this.exibirListaMarcas11 = false; // Oculta a lista de marcas
      this.exibirSoUmaMarca11 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onMarcaChange12(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("marca12") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.marcaSelecionada12) {
      this.marcaSelecionada12 = newValue;
      this.marcaSelecionada = newValue;
      this.exibirListaMarcas12 = false; // Oculta a lista de marcas
      this.exibirSoUmaMarca12 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onMarcaChange13(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("marca13") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.marcaSelecionada13) {
      this.marcaSelecionada13 = newValue;
      this.marcaSelecionada = newValue;
      this.exibirListaMarcas13 = false; // Oculta a lista de marcas
      this.exibirSoUmaMarca13 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onMarcaChange14(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("marca14") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.marcaSelecionada14) {
      this.marcaSelecionada14 = newValue;
      this.marcaSelecionada = newValue;
      this.exibirListaMarcas14 = false; // Oculta a lista de marcas
      this.exibirSoUmaMarca14 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onMarcaChange15(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("marca15") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.marcaSelecionada15) {
      this.marcaSelecionada15 = newValue;
      this.marcaSelecionada = newValue;
      this.exibirListaMarcas15 = false; // Oculta a lista de marcas
      this.exibirSoUmaMarca15 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onMarcaChange16(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("marca16") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.marcaSelecionada16) {
      this.marcaSelecionada16 = newValue;
      this.marcaSelecionada = newValue;
      this.exibirListaMarcas16 = false; // Oculta a lista de marcas
      this.exibirSoUmaMarca16 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onMarcaChange17(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("marca17") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.marcaSelecionada17) {
      this.marcaSelecionada17 = newValue;
      this.marcaSelecionada = newValue;
      this.exibirListaMarcas17 = false; // Oculta a lista de marcas
      this.exibirSoUmaMarca17 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onMarcaChange18(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("marca18") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.marcaSelecionada18) {
      this.marcaSelecionada18 = newValue;
      this.marcaSelecionada = newValue;
      this.exibirListaMarcas18 = false; // Oculta a lista de marcas
      this.exibirSoUmaMarca18 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onMarcaChange19(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("marca19") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.marcaSelecionada19) {
      this.marcaSelecionada19 = newValue;
      this.marcaSelecionada = newValue;
      this.exibirListaMarcas19 = false; // Oculta a lista de marcas
      this.exibirSoUmaMarca19 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
}

onMarcaChange20(): void {
  setTimeout(() => {
    const selectElement = document.getElementById("marca20") as HTMLSelectElement;
    const newValue = selectElement.value;
    if (newValue !== this.marcaSelecionada20) {
      this.marcaSelecionada20 = newValue;
      this.marcaSelecionada = newValue;
      this.exibirListaMarcas20 = false; // Oculta a lista de marcas
      this.exibirSoUmaMarca20 = true;   // Exibe o input com a marca selecionada
    }
  }, 100);
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

// ESCUTA Os SELECTs GARANTIAs //////////////////////////////////////////////
onGarantiaChange1(event: Event): void {
  this.garantiaSelecionada1 = (event.target as HTMLSelectElement).value;
  this.garantiaSelecionada = this.garantiaSelecionada1;
  console.log(this.garantiaSelecionada); 
}

onGarantiaChange2(event: Event): void {
  this.garantiaSelecionada2 = (event.target as HTMLSelectElement).value;
  this.garantiaSelecionada = this.garantiaSelecionada2;
  console.log(this.garantiaSelecionada); 
}

onGarantiaChange3(event: Event): void {
  this.garantiaSelecionada3 = (event.target as HTMLSelectElement).value;
  this.garantiaSelecionada = this.garantiaSelecionada3;
  console.log(this.garantiaSelecionada); 
}

onGarantiaChange4(event: Event): void {
  this.garantiaSelecionada4 = (event.target as HTMLSelectElement).value;
  this.garantiaSelecionada = this.garantiaSelecionada4;
  console.log(this.garantiaSelecionada); 
}

onGarantiaChange5(event: Event): void {
  this.garantiaSelecionada5 = (event.target as HTMLSelectElement).value;
  this.garantiaSelecionada = this.garantiaSelecionada5;
  console.log(this.garantiaSelecionada); 
}

onGarantiaChange6(event: Event): void {
  this.garantiaSelecionada6 = (event.target as HTMLSelectElement).value;
  this.garantiaSelecionada = this.garantiaSelecionada6;
  console.log(this.garantiaSelecionada); 
}

onGarantiaChange7(event: Event): void {
  this.garantiaSelecionada7 = (event.target as HTMLSelectElement).value;
  this.garantiaSelecionada = this.garantiaSelecionada7;
  console.log(this.garantiaSelecionada); 
}

onGarantiaChange8(event: Event): void {
  this.garantiaSelecionada8 = (event.target as HTMLSelectElement).value;
  this.garantiaSelecionada = this.garantiaSelecionada8;
  console.log(this.garantiaSelecionada); 
}

onGarantiaChange9(event: Event): void {
  this.garantiaSelecionada9 = (event.target as HTMLSelectElement).value;
  this.garantiaSelecionada = this.garantiaSelecionada9;
  console.log(this.garantiaSelecionada); 
}

onGarantiaChange10(event: Event): void {
  this.garantiaSelecionada10 = (event.target as HTMLSelectElement).value;
  this.garantiaSelecionada = this.garantiaSelecionada10;
  console.log(this.garantiaSelecionada); 
}

onGarantiaChange11(event: Event): void {
  this.garantiaSelecionada11 = (event.target as HTMLSelectElement).value;
  this.garantiaSelecionada = this.garantiaSelecionada11;
  console.log(this.garantiaSelecionada); 
}

onGarantiaChange12(event: Event): void {
  this.garantiaSelecionada12 = (event.target as HTMLSelectElement).value;
  this.garantiaSelecionada = this.garantiaSelecionada12;
  console.log(this.garantiaSelecionada); 
}

onGarantiaChange13(event: Event): void {
  this.garantiaSelecionada13 = (event.target as HTMLSelectElement).value;
  this.garantiaSelecionada = this.garantiaSelecionada13;
  console.log(this.garantiaSelecionada); 
}

onGarantiaChange14(event: Event): void {
  this.garantiaSelecionada14 = (event.target as HTMLSelectElement).value;
  this.garantiaSelecionada = this.garantiaSelecionada14;
  console.log(this.garantiaSelecionada); 
}

onGarantiaChange15(event: Event): void {
  this.garantiaSelecionada15 = (event.target as HTMLSelectElement).value;
  this.garantiaSelecionada = this.garantiaSelecionada15;
  console.log(this.garantiaSelecionada); 
}

onGarantiaChange16(event: Event): void {
  this.garantiaSelecionada16 = (event.target as HTMLSelectElement).value;
  this.garantiaSelecionada = this.garantiaSelecionada16;
  console.log(this.garantiaSelecionada); 
}

onGarantiaChange17(event: Event): void {
  this.garantiaSelecionada17 = (event.target as HTMLSelectElement).value;
  this.garantiaSelecionada = this.garantiaSelecionada17;
  console.log(this.garantiaSelecionada); 
}

onGarantiaChange18(event: Event): void {
  this.garantiaSelecionada18 = (event.target as HTMLSelectElement).value;
  this.garantiaSelecionada = this.garantiaSelecionada18;
  console.log(this.garantiaSelecionada); 
}

onGarantiaChange19(event: Event): void {
  this.garantiaSelecionada19 = (event.target as HTMLSelectElement).value;
  this.garantiaSelecionada = this.garantiaSelecionada19;
  console.log(this.garantiaSelecionada); 
}

onGarantiaChange20(event: Event): void {
  this.garantiaSelecionada20 = (event.target as HTMLSelectElement).value;
  this.garantiaSelecionada = this.garantiaSelecionada20;
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
      this.buscaUltimaOsAsync();
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
        this.equipamentos = dados; // Certifique-se de que os dados estão sendo atribuídos aqui
        console.log("Equipamentos carregados:", this.equipamentos); // Log para verificar
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

  async salvarOrdemServicoAsync(os: any): Promise<void> {
    try {
        const result = await this.servico.cadastrarOs(os).toPromise(); // Converte o Observable em Promise
        console.log('Ordem de serviço salva com sucesso!', result);
        this.os = { ...os }; // Garante que Angular detecte a mudança
        this.cdr.detectChanges(); // Força a detecção de mudanças
        console.log("Ordem de Serviço atualizada:", this.os);

    } catch (err) {
        console.error('Erro ao salvar a ordem de serviço:', err);
        alert('Erro ao salvar a ordem de serviço.');
    }
}
  
async buscaUltimaOsAsync(): Promise<void> {
  return new Promise((resolve, reject) => {
      this.servico?.ultimaOs().subscribe({
          next: (retorno: number) => {
              this.ultimaOs = retorno;
              this.novaOs = this.ultimaOs + 1;  // Atualiza novaOs após cada busca
              console.log("Este é a última OS: " + this.ultimaOs);
              resolve(); // Indica que a Promise foi concluída com sucesso
          },
          error: (err) => {
              console.error('Erro ao buscar a última OS:', err);
              alert('Erro ao buscar o número da última OS.');
              reject(err); // Indica que houve um erro
          },
      });
  });
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

    setTimeout(() => {  // aguarda 1 segundo para fechar a tabela
      this.exibirTabela = false;
      this.cdr.detectChanges(); // Força a atualização da visualização imediatamente
    }, 1000);

  }


async enviarOs(): Promise<void> {
    // Verificar se o método já está sendo executado
    if (this.lock) {
        console.warn('O método enviarOs já está em execução.');
        return;
    }

    // Ativar o bloqueio para impedir chamadas simultâneas
    this.lock = true;

    try {
        // Buscar a última OS antes de começar o loop
        await this.buscaUltimaOsAsync();
        console.log('Última OS:', this.ultimaOs);

        // Definir o valor de novaOsLocal fora do loop
        let novaOsLocal = this.ultimaOs + 1;

        
        // Loop para processar os equipamentos
        for (let i = 1; i <= this.contadorEquipamento; i++) {
            const agora = new Date();
            const dataFormatada = agora.toISOString().split('T')[0] + "T00:00:00";
            const horas = String(agora.getHours()).padStart(2, '0');
            const minutos = String(agora.getMinutes()).padStart(2, '0');
            const segundos = String(agora.getSeconds()).padStart(2, '0');

            ////ESCREVE NUM OS NO INPUT DO FORMULÁRIO
        this.formulario.patchValue({
          [`os${i}`]: String(this.novaOs)
      });



            console.log(`Processando equipamento ${i}:`);
            console.log("Data formatada:", dataFormatada);
            console.log("Hora:", `${horas}:${minutos}:${segundos}`);
            console.log("Nova OS:", novaOsLocal);
            (this as any)[`exibirOs${i}`] = true; // controle de impressão só das os existentes

            const os = {
                data: dataFormatada,
                hora: `${horas}:${minutos}:${segundos}`,
                os: novaOsLocal,
                fantasia: this.formulario.value.fantasia || "",
                rzsocial: this.formulario.value.rzsocial || "",
                codcli: this.formulario.value.codcli || "",
                atendente: this.atendenteSelecionado || "",
                equipamento: this.formulario.value[`equipamento${i}` as keyof typeof this.formulario.value],
                marca: this.formulario.value[`marca${i}` as keyof typeof this.formulario.value],
                modelo: this.formulario.value[`modelo${i}` as keyof typeof this.formulario.value],
                serial: this.formulario.value[`serial${i}` as keyof typeof this.formulario.value],
                patrimonio: this.formulario.value[`patrimonio${i}` as keyof typeof this.formulario.value],
                garantia: this.formulario.value[`garantia${i}` as keyof typeof this.formulario.value],
                status: 'ABERTA',
                prioridade: "",
                topologia: "",
                cor: "",
                obs1: "",
                obs2: "",
                defeito1: "",
                defeito2: "",
                defeito3: "",
                tarefa1: "",
                tarefa2: "",
                tarefa3: "",
                baterias: "",
                material2: "",
                material3: "",
                outrositens: "",
                qt1: "0",
                qt2: "0",
                qt3: "0",
                qtoutrositens: "0",
                qtdeslocamento: "0",
                valorunit1: "0.00",
                valorunit2: "0.00",
                valorunit3: "0.00",
                valorunitoutrositens: "0.00",
                valorunitariodeslocamento: "0.00",
                valortotal1: "0.00",
                valortotal2: "0.00",
                valortotal3: "0.00",
                valortotaloutrositens: "0.00",
                valortotaldeslocamento: "0.00",
                valorassistencia: "0.00",
                totalbruto: "0.00",
                valordesconto: "0.00",
                desconto: "0",
                totaliq: "0.00",
                fechamento: "",
                tecnico: "",
                dataorca: "",
                osoriginal: "",
                venda: "",
                modelofake: "",
                obs3: "",
                jaimp: "",
                top10: 0,
                dataretro: "",
            };

            console.log("Criando ordem de serviço:", os);

            // Salvar a OS
            await this.salvarOrdemServicoAsync(os);
            console.log("Ordem de Serviço cadastrada com sucesso:", os);
            console.log(" buscando atendente " + os.atendente);
            (this as any)[`os${i}`] = String(os.os);
            (this as any)[`serial${i}`] = String(os.serial);
            (this as any)[`patrimonio${i}`] = String(os.patrimonio);
            
            


            // Incrementar novaOsLocal para a próxima iteração
            novaOsLocal++;

            // Atualizar a última OS após a inserção
            await this.buscaUltimaOsAsync();
        }

        

        alert('Todas as Ordens de Serviço foram cadastradas com sucesso!');
    } catch (error) {
        console.error('Erro durante o processo de envio de OS:', error);
    } finally {
        // Libera o bloqueio após a conclusão ou erro
        this.lock = false;
        this.exibirBotaoSair = true;
        this.exibirBotaoSalvar = false;
        this.exibirNumeroNovaOs = true;
        this.exibirBotaoImprimir = true;

    }
}



adicionarEquipamento(){
  this.contadorEquipamento += 1;
  console.log(this.contadorEquipamento);

    switch (this.contadorEquipamento) {
       
       case 1:
      this.exibirEntrada1 = true;
       break;
      
       case 2:
       this.exibirEntrada2 = true;
       break;
      
       case 3:
       this.exibirEntrada3 = true;
       break;
      
       case 4:
       this.exibirEntrada4 = true;
       break;
      
       case 5:
       this.exibirEntrada5 = true;
       break;
      
       case 6:
       this.exibirEntrada6 = true;
     break;

     case 7:
       this.exibirEntrada7 = true;
     break;

     case 8:
       this.exibirEntrada8 = true;
     break;

     case 9:
       this.exibirEntrada9 = true;
     break;

     case 10:
       this.exibirEntrada10 = true;
     break;
      
     case 11:
       this.exibirEntrada11 = true;
     break;

     case 12:
       this.exibirEntrada12 = true;
     break;

     case 13:
       this.exibirEntrada13 = true;
     break;

     case 14:
       this.exibirEntrada14 = true;
     break;

     case 15:
       this.exibirEntrada15 = true;
     break;

     case 16:
       this.exibirEntrada16 = true;
     break;

     case 17:
       this.exibirEntrada17 = true;
     break;

     case 18:
       this.exibirEntrada18 = true;
     break;

     case 19:
       this.exibirEntrada19 = true;
     break;

     case 20:
       this.exibirEntrada20 = true;
     break;
       default:
        alert(" Você ultrapassou o limite máximo de Entrada de equipamentos:    (10 equipamentos), salve este e abre um novo lote de ordem de serviço ")
      break;
     }
      
  

}

gerarPDF() {
  this.exibirComprovante = true;

  setTimeout(() => {
    const element = document.getElementById('pdf-content'); // Seleciona o conteúdo do HTML
    
    if (element) {
      const pdf = new jsPDF('p', 'mm', 'a4'); // Configura o PDF no formato A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        // Calcula o número de páginas necessário
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imgHeight = (canvasHeight * pdfWidth) / canvasWidth; // Altura proporcional no PDF
        let heightLeft = imgHeight; // Altura restante para renderizar

        let position = 0; // Posição inicial na página

        // Adiciona a primeira página
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Adiciona páginas restantes, se necessário
        while (heightLeft > 0) {
          position = heightLeft - imgHeight; // Atualiza a posição
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

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

private isClickEvent: boolean = false;
limpar() {

  console.log(" o botão limpar foi clicado")
  if (!this.isClickEvent) {
    return; // Sai da função se não foi disparada por um clique
  }

  this.isClickEvent = false; // Reseta a flag após o clique
  this.router.navigate(['/home']).then(() => {
    this.router.navigate(['os/lote']);
  });
}

onButtonClick() {
  this.isClickEvent = true; // Define a flag quando o botão é clicado
  this.limpar(); // Chama a função
}



}
