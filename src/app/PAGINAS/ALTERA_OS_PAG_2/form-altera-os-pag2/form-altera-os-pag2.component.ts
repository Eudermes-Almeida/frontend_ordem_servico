import { ChangeDetectorRef, Component } from '@angular/core';
import { ParametrosCombobox } from '../../../modelo/ParametrosCombobox';
import { Cliente } from '../../../modelo/Cliente';
import { Os } from '../../../modelo/Os';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ParametrosService } from '../../../servico/parametros.service';
import { OrdemservicoService } from '../../../servico/ordemservico.service';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Validator } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Financeiro } from '../../../modelo/Financeiro';
import { FinanceiroService } from '../../../servico/financeiro.service';
import { catchError, of } from 'rxjs';


@Component({
  selector: 'app-form-altera-os-pag2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-altera-os-pag2.component.html',
  styleUrl: './form-altera-os-pag2.component.css'
})
export class FORMALTERAOSPAG2Component {
 
  equipamentos: ParametrosCombobox[] = [];
  equipamentoSelecionado: string = "";
  equipamentosPosicaoZero: any = { id: 100, parametro: 'EQUIPAMENTO', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  statusOs: ParametrosCombobox[] = [];
  statusOsSelecionado: string = "";
  statusOsPosicaoZero: any = { id: 100, parametro: 'STATUS', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  tecnicos: ParametrosCombobox[] = [];
  tecnicoSelecionado: string = "";
  tecnicoPosicaoZero: any = { id: 100, parametro: 'TECNICO', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  tarefaExecutada: ParametrosCombobox[] = [];
  tarefaExecutadaSelecionado: string = "";
  tarefaExecutadaPosicaoZero: any = { id: 100, parametro: 'EQUIPAMENTO', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  modeloBaterias: ParametrosCombobox[] = [];
  modeloBateriasSelecionado: string = "";
  modeloBateriasPosicaoZero: any = { id: 100, parametro: 'BATERIAS', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

  materiais: ParametrosCombobox[] = [];
  materiaisSelecionado: string = "";
  materiaisPosicaoZero: any = { id: 100, parametro: 'EQUIPAMENTO', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"


  cliente: Cliente = new Cliente();
  os: Os = new Os();
  objetocliente: Cliente[] = [];
  objetoOs: Os[] = [];
  id: number = 0;
  modeloFinanceiro: Financeiro = new Financeiro();

  ///////////CONTROLE DE RENDERIZAÇÃO/////////
  exibirBotaoSalvar: boolean = true;
  exibirBotaoSair: boolean = false;
  exibirTextoOssalva: boolean = false;
  exibirAlertOsSalva: boolean = false;
  exibirAlertErroValidacao: boolean = false;
  monitoraMudancaSelectStatus: boolean = false;
  exibeMensagemErroValidacao: boolean = false;
  exibirImpOs: boolean = false;
  exibirBotaoImprimir: boolean = false;
  /** true quando a OS está GRAVADA como FECHADA (ao abrir ou depois de salvar) -> botão "Imprimir etiqueta" */
  osSalvaFechada: boolean = false;
  

  // CONFIGURA FORMULÁRIO
  formulario = new FormGroup({
    os:new FormControl(''),
    data:new FormControl(''),
    hora:new FormControl(''),
    fantasia:new FormControl(''),
    rzsocial:new FormControl(''),
    codcli:new FormControl(''),
    atendente:new FormControl(''),
    status:new FormControl('', Validators.required),
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
    tarefa1:new FormControl('', Validators.required),
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
    valortotal1: new FormControl({ value: '', disabled: true }),  // Total desabilitado para edição manual
    valortotal2:new FormControl({ value: '', disabled: true }),
    valortotal3:new FormControl({ value: '', disabled: true }), 
    valortotaloutrositens:new FormControl({ value: '', disabled: true }),
    valortotaldeslocamento:new FormControl({ value: '', disabled: true }),
    valorassistencia:new FormControl(''),
    totalbruto:new FormControl({ value: '', disabled: true }),
    valordesconto:new FormControl(''),
    desconto:new FormControl(''),
    totaliq:new FormControl({ value: '', disabled: true }),
    fechamento:new FormControl(''),
    tecnico:new FormControl('', Validators.required),
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
      private route: ActivatedRoute, // Injeta a rota ativa
      private financeiroService: FinanceiroService 
  ) {}


  ////////////////ESCUTA OS SELECT'S /////////////////////////////////////////////////
// ESCUTA O SELECT EQUIPAMENTOS
onEquipamentoChange(event: Event): void {
  this.equipamentoSelecionado = (event.target as HTMLSelectElement).value;
  console.log(this.equipamentoSelecionado);
}

// ESCUTA O SELECT STATUS OS
onStatusChange(event: Event): void {
  this.statusOsSelecionado = (event.target as HTMLSelectElement).value;
  console.log(this.statusOsSelecionado);
  this.monitoraMudancaSelectStatus = true;


  if (this.statusOsSelecionado === 'FECHADA') {
    // Obter a data de hoje
    const hoje = new Date();
    
    // Formatar para 'DD-MM-AAAA'
    const dia = String(hoje.getDate()).padStart(2, '0'); // Dia com dois dígitos
    const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Mês com dois dígitos (Janeiro é 0)
    const ano = hoje.getFullYear();
    const dataHojeFormatada = `${dia}-${mes}-${ano}`;
    // Atualizar o campo 'fechamento' com a data de hoje formatada
    this.formulario.patchValue({
      fechamento: dataHojeFormatada,
    });
  }


  if (this.statusOsSelecionado === 'PASSAR ORÇ') {
    // Obter a data de hoje
    const hoje = new Date();
    
    // Formatar para 'DD-MM-AAAA'
    const dia = String(hoje.getDate()).padStart(2, '0'); // Dia com dois dígitos
    const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Mês com dois dígitos (Janeiro é 0)
    const ano = hoje.getFullYear();
    const dataHojeFormatada = `${dia}-${mes}-${ano}`;
    // Atualizar o campo 'fechamento' com a data de hoje formatada
    this.formulario.patchValue({
      dataorca: dataHojeFormatada,
    });
  }

}


// ESCUTA O SELECT TÉCNICOS
onTecnicosChange(event: Event): void {
  this.tecnicoSelecionado = (event.target as HTMLSelectElement).value;
  console.log(this.tecnicoSelecionado);
}

// ESCUTA O SELECT TAREFA REALIZADA
onTarefaRealizadaChange(event: Event): void {
  this.tarefaExecutadaSelecionado = (event.target as HTMLSelectElement).value;
  console.log(this.tarefaExecutadaSelecionado);
}

// ESCUTA O MODELOS BATERIAS
onModelosBateriaChange(event: Event): void {
  this.modeloBateriasSelecionado = (event.target as HTMLSelectElement).value;
  console.log(this.modeloBateriasSelecionado);
}

// ESCUTA O SELECT MATERIAL 2 e MATERIAL 3
onMaterialChange(event: Event): void {
  this.materiaisSelecionado = (event.target as HTMLSelectElement).value;
  console.log(this.materiaisSelecionado);
}


  // CONFIGURA AS FUNÇÕES QUE SERÃO EXECUTADAS NA INICIALIZAÇÃO DA PÁGINA
  ngOnInit(): void {
    if (this.parametrosService) {
      //this.ativarFullscreen();
      this.buscarStatus();
      this.buscarTecnicos();
      this.buscarTarefasExecutadas();
      this.buscarModelosBaterias();
      this.buscarMateriais();
      this.onValorSubTotais(); // Configura os valueChanges apenas uma vez na inicialização
    
    }

    // Chama o método para carregar o número da OS da URL assim que a página for carregada
    this.carregaNumOsdaUrl();
    
  }

  //////////////////CAPTURA NUM OS QUE VEIO NA URL E CHAMA FUNÇÃO PARA BUSCA O OBJETO OS //////
  carregaNumOsdaUrl(): void {
    // Captura o ID da URL
    const id = Number(this.route.snapshot.paramMap.get('os'));
    console.log(" Este é o numero da os capturado via url : " + id)

    if (id) {
      console.log("entrou no if do id")
      this.getOsPorId(id).pipe(
        switchMap((os) => {
          console.log("chamou o getOsPorId")

          // `os` é o retorno do método getOsPorId
          const codcli = Number(os.codcli);
          console.log('ID do cliente obtido:', codcli);
          console.log("vai chamar o getCliente segue o codcli: " + codcli);
          return this.getCliente(codcli); // Chama o método getCliente apenas após obter os dados de OS
        })
      ).subscribe({
        next: (cliente) => {
          console.log('Cliente obtido com sucesso:', cliente);
        },
        error: (error) => {
          console.error('Erro durante as chamadas:', error);
        }
      });
    } else {
      console.error('ID não encontrado na URL');
    }
  }

  
  ///////////////////BUSCA DADOS PARA POUPULAR OS SELECTS //////////////////
  
  // busca os Equipamentos no parametro para popular o select
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

  // busca os Equipamentos no parametro para popular o select
  buscarStatus(): void {
    this.parametrosService?.getStatusOs().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.statusOs = dados;
        this.statusOs.unshift(this.statusOsPosicaoZero);
        console.log(this.statusOs);
      },
      (erro) => {
        console.error('Erro ao buscar Status de O.S:', erro);
      }
    );
  }

  // busca os Técnicos para popular o select
  buscarTecnicos(): void {
    this.parametrosService?.getTecnicos().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.tecnicos = dados;
        this.tecnicos.unshift(this.tecnicoPosicaoZero);
        console.log(this.tecnicos);
      },
      (erro) => {
        console.error('Erro ao buscar Tecnicos:', erro);
      }
    );
  }

  // busca as tarefas para popular o select
  buscarTarefasExecutadas(): void {
    this.parametrosService?.getTarefaExecutada().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.tarefaExecutada = dados;
        this.tarefaExecutada.unshift(this.tarefaExecutadaPosicaoZero);
        console.log(this.tarefaExecutada);
      },
      (erro) => {
        console.error('Erro ao buscar Tarefa Executada:', erro);
      }
    );
  }

  // busca Baterias para popular o select
  buscarModelosBaterias(): void {
    this.parametrosService?.getMOdelosBaterias().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.modeloBaterias = dados;
        this.modeloBaterias.unshift(this.modeloBateriasPosicaoZero);
        console.log(this.modeloBaterias);
      },
      (erro) => {
        console.error('Erro ao buscar Modelo Baterias:', erro);
      }
    );
  }

// busca os Materiais para popular o select
buscarMateriais(): void {
  this.parametrosService?.getMaterial().subscribe(
    (dados: ParametrosCombobox[]) => {
      this.materiais = dados;
      this.materiais.unshift(this.materiaisPosicaoZero);
      console.log(this.materiais);
    },
    (erro) => {
      console.error('Erro ao buscar Materiais:', erro);
    }
  );
}


  /////////////ESCREVE DADOS NOS INPUTS/////////////////////////////
  escreveDadosOsNosInputs(os: Os): void {
    console.log('Dados da Ordem de serviço antes de escrever nos inputs:', os);

    // Ajustando a data do orçamento
    if(this.os.dataorca){
const dataAjustada = os.dataorca.split('T')[0];
const partesData = dataAjustada.split('-'); // ["2024", "11", "06"]
const dataFormatada = `${partesData[2]}-${partesData[1]}-${partesData[0]}`; // "06-11-2024"
this.formulario.patchValue({
  dataorca: dataFormatada, // Define apenas a parte de data no input, que o formato de input,
})
}
    ////////AJUSTANDO A DATA DO FECHAMENTO/////////////////////
    // Extrai apenas a parte da data "2024-11-06" da string completa "2024-11-06T03:00:00"
    if(this.os.fechamento){
    const dataFechamentoAjustada = os.fechamento.split('T')[0];
    // Formata para 'DD-MM-AAAA'
    const partes2Data = dataFechamentoAjustada.split('-'); // ["2060", "11", "14"]
    const dataFechamentoFormatada = `${partes2Data[2]}-${partes2Data[1]}-${partes2Data[0]}`; // "14-11-2060"
    this.formulario.patchValue({
      fechamento: dataFechamentoFormatada, // Formata para 'dd/MM/yyyy'
    })
  }


        this.formulario.patchValue({
            os: os.os.toString(), 
            //data: new Date(os.data).toLocaleDateString('pt-BR'), // Formata para 'dd/MM/yyyy'
            //dataorca: dataAjustada, // Define apenas a parte de data no input, que o formato de input "date" aceita
            status: os.status,
            fantasia: os.fantasia,
            tarefa1: os.tarefa1,
            tarefa2: os.tarefa2,
            tarefa3: os.tarefa3,
            baterias: os.baterias ? os.baterias.replace('BATERIA ', '').trim() : '',
            material2: os.material2,
            material3: os.material3,
            outrositens: os.outrositens,
            qt1: os.qt1,
            qt2: os.qt2,
            qt3: os.qt3,
            qtoutrositens: os.qtoutrositens,
            qtdeslocamento: os.qtdeslocamento,
            valorunit1: os.valorunit1,
            valorunit2: os.valorunit2,
            valorunit3: os.valorunit3,
            valorunitoutrositens: os.valorunitoutrositens,
            valorunitariodeslocamento: os.valorunitariodeslocamento,
            valortotal1: os.valortotal1,
            valortotal2: os.valortotal2,
            valortotal3: os.valortotal3,
            valortotaloutrositens: os.valortotaloutrositens,
            valortotaldeslocamento: os.valortotaldeslocamento,
            valorassistencia: os.valorassistencia,
            totalbruto: os.totalbruto,
            valordesconto: os.valordesconto,
            desconto: os.desconto,
            totaliq: os.totaliq,
            tecnico: os.tecnico,
            garantia: os.garantia,
            osoriginal: os.osoriginal,
            venda: os.venda,
            modelofake: os.modelofake,
            obs3: os.obs3,
            jaimp: os.jaimp,

        });
  }

  // Busca ORDEM SERVIÇO por id
  ////////////////// ETIQUETA 100 x 50 mm COM QR CODE (só OS FECHADA) //////
  statusFechada(status: string | null | undefined): boolean {
    return (status || '').trim().toUpperCase() === 'FECHADA';
  }

  imprimirEtiqueta(): void {
    if (!this.os?.os) return;
    window.open(`/os/etiqueta/${this.os.os}`, '_blank');
  }

  // Atualização do método getOsPorId para retornar um Observable
getOsPorId(os: number): Observable<Os> {
  console.log(`Este é o num os recebido na url ${os}`);
  return this.servico.getOsPorId(os).pipe(
    tap((data: Os) => {
      this.objetoOs = [data]; // Coloca a ordem de serviço dentro de um array
      this.os = data; // Atualiza os dados da ordem de serviço
      this.osSalvaFechada = this.statusFechada(data?.status);
      console.log('O.S. obtida:', this.objetoOs);
      this.escreveDadosOsNosInputs(data);
    })
  );
}

  // Busca Clientes por id
  getCliente(id: number): Observable<Cliente> {
    return this.servico.getClientePorId(id).pipe(
      tap((data: Cliente) => {
        this.objetocliente = [data]; // Coloca o cliente dentro de um array
        this.cliente = data;  // ATUALIZA OS DADOS DO CLIENTE
        console.log('Cliente obtido:', this.objetocliente);
      })
    );
  }

  //////////////////////////////CALCULOS//////////////////////////////////

  // calcula o valor total 1:

  // Escutar mudanças em `qt1` e `valorunit1` para atualizar `valortotal1`
  onValorTotal1(){
  this.formulario.get('qt1')?.valueChanges.subscribe(() => this.atualizarValortotal1());
  this.formulario.get('valorunit1')?.valueChanges.subscribe(() => this.atualizarValortotal1());
}

/**
 * Botões - / + dos campos de quantidade (opcional: o usuário também pode digitar no campo).
 * Soma `passo` à quantidade (nunca abaixo de 0) e chama o mesmo recálculo que a digitação chama;
 * o total bruto/líquido se atualiza sozinho pelos valueChanges dos subtotais.
 */
alterarQuantidade(campo: string, passo: number, recalcular: string): void {
  const controle = this.formulario.get(campo);
  if (!controle) return;
  const atual = parseFloat(String(controle.value ?? '').replace(',', '.')) || 0;
  const novo = Math.max(0, Math.round((atual + passo) * 100) / 100);
  controle.setValue(String(novo));
  controle.markAsDirty();
  (this as any)[recalcular]?.();
}

atualizarValortotal1() {
  const qt1 = parseFloat(this.formulario.get('qt1')?.value) || 0;
  const valorunit1 = parseFloat(this.formulario.get('valorunit1')?.value) || 0;
  const total = (qt1 * valorunit1).toFixed(2); // Formata para duas casas decimais
  this.formulario.get('valortotal1')?.setValue(total);
}

// Escutar mudanças em `qt2` e `valorunit2` para atualizar `valortotal2`
onValorTotal2(){
  this.formulario.get('qt2')?.valueChanges.subscribe(() => this.atualizarValortotal2());
  this.formulario.get('valorunit2')?.valueChanges.subscribe(() => this.atualizarValortotal2());
}

atualizarValortotal2() {
  const qt2 = parseFloat(this.formulario.get('qt2')?.value) || 0;
  const valorunit2 = parseFloat(this.formulario.get('valorunit2')?.value) || 0;
  const total = (qt2 * valorunit2).toFixed(2); // Formata para duas casas decimais
  this.formulario.get('valortotal2')?.setValue(total);
}

// Escutar mudanças em `qt3` e `valorunit3` para atualizar `valortotal3`
onValorTotal3(){
  this.formulario.get('qt3')?.valueChanges.subscribe(() => this.atualizarValortotal3());
  this.formulario.get('valorunit3')?.valueChanges.subscribe(() => this.atualizarValortotal3());
}

atualizarValortotal3() {
  const qt3 = parseFloat(this.formulario.get('qt3')?.value) || 0;
  const valorunit3 = parseFloat(this.formulario.get('valorunit3')?.value) || 0;
  const total = (qt3 * valorunit3).toFixed(2); // Formata para duas casas decimais
  this.formulario.get('valortotal3')?.setValue(total);
}

// Escutar mudanças em `qtoutros itnes` e `valorunitário outros itens` para atualizar `valortotal3`
onValorTotalOutrosItens(){
  this.formulario.get('qtoutrositens')?.valueChanges.subscribe(() => this.atualizarValorTotalOutrosItens());
  this.formulario.get('valorunitoutrositens')?.valueChanges.subscribe(() => this.atualizarValorTotalOutrosItens());
}

atualizarValorTotalOutrosItens() {
  const qtoutrositens = parseFloat(this.formulario.get('qtoutrositens')?.value) || 0;
  const valorunitoutrositens = parseFloat(this.formulario.get('valorunitoutrositens')?.value) || 0;
  const total = ( qtoutrositens * valorunitoutrositens ).toFixed(2); // Formata para duas casas decimais
  this.formulario.get('valortotaloutrositens')?.setValue(total);
}

// Escutar mudanças em `qt deslocamento` e `valorunitário deslocamento` para atualizar `valortotal deslocamento`
onValorTotalDeslocamento(){
  this.formulario.get('qtdeslocamento')?.valueChanges.subscribe(() => this.atualizarValorTotalDeslocamento());
  this.formulario.get('valorunitariodeslocamento')?.valueChanges.subscribe(() => this.atualizarValorTotalDeslocamento());
}

atualizarValorTotalDeslocamento() {
  const qtdeslocamento = parseFloat(this.formulario.get('qtdeslocamento')?.value) || 0;
  const valorunitariodeslocamento = parseFloat(this.formulario.get('valorunitariodeslocamento')?.value) || 0;
  const total = ( qtdeslocamento * valorunitariodeslocamento ).toFixed(2); // Formata para duas casas decimais
  this.formulario.get('valortotaldeslocamento')?.setValue(total);
}

// Escutar mudanças em sub-totais, para alterar total bruto
onValorSubTotais() {
  // Escutar mudanças em todos os sub-totais para atualizar o total bruto automaticamente
  const camposSubTotais = [
    'valortotal1',
    'valortotal2',
    'valortotal3',
    'valortotaldeslocamento',
    'valortotaloutrositens',
    'valorassistencia'
  ];

  camposSubTotais.forEach(campo => {
    this.formulario.get(campo)?.valueChanges.subscribe(() => this.atualizarValorTotalBruto());
  });
}

atualizarValorTotalBruto() {
  const valorTotal_1 = parseFloat(this.formulario.get('valortotal1')?.value) || 0;
  const valorTotal_2 = parseFloat(this.formulario.get('valortotal2')?.value) || 0;
  const valorTotal_3 = parseFloat(this.formulario.get('valortotal3')?.value) || 0;
  const valorTotal_OutrosItens = parseFloat(this.formulario.get('valortotaloutrositens')?.value) || 0;
  const valorTotal_deslocamento = parseFloat(this.formulario.get('valortotaldeslocamento')?.value) || 0;
  const valor_assitencia = parseFloat(this.formulario.get('valorassistencia')?.value) || 0;

  const valor_totalBruto = valorTotal_1 + valorTotal_2 + valorTotal_3 + valorTotal_OutrosItens + valorTotal_deslocamento + valor_assitencia;
  const valor_totalBruto_formatado = valor_totalBruto.toFixed(2);
  this.formulario.get('totalbruto')?.setValue(valor_totalBruto_formatado, { emitEvent: false });
  this.formulario.get('totaliq')?.setValue(valor_totalBruto_formatado, { emitEvent: false });
}
// SUBTRAI:  TOTAL BRUTO - VALOR DESCONTO $ = TOTAL LIQUIDO:
onDescontovalor() {
  const valorBruto = parseFloat(this.formulario.get('totalbruto')?.value) || 0;
  const valorDesconto = parseFloat(this.formulario.get('valordesconto')?.value) || 0;

  if (valorBruto > 0) {
    const totalLiquido = valorBruto - valorDesconto;
    const percentual = (valorDesconto / valorBruto) * 100;

    this.formulario.patchValue({
      totaliq: totalLiquido.toFixed(2),
      desconto: percentual.toFixed(2) // Atualiza o campo %
    }, { emitEvent: false });
  }
}

onDescontoPercentual() {
  const valorBruto = parseFloat(this.formulario.get('totalbruto')?.value) || 0;
  const percentual = parseFloat(this.formulario.get('desconto')?.value) || 0;

  if (valorBruto > 0) {
    const valorDesconto = valorBruto * (percentual / 100);
    const totalLiquido = valorBruto - valorDesconto;

    this.formulario.patchValue({
      totaliq: totalLiquido.toFixed(2),
      valordesconto: valorDesconto.toFixed(2) // Atualiza o campo $
    }, { emitEvent: false });
  }
}

subtraiDescontoDeTotalBruto() {
  const valor_totalBruto = parseFloat(this.formulario.get('totalbruto')?.value) || 0;
  const valor_desconto = parseFloat(this.formulario.get('valordesconto')?.value) || 0;
  
  // 1. Calcula o total líquido
  const total_liquido = (valor_totalBruto - valor_desconto).toFixed(2);

  // 2. Calcula o percentual que esse valor representa sobre o bruto
  let percentual = 0;
  if (valor_totalBruto > 0) {
    percentual = (valor_desconto / valor_totalBruto) * 100;
  }

  // 3. Atualiza os campos usando patchValue (evita erro de tipo 'never')
  this.formulario.patchValue({
    totaliq: total_liquido,
    desconto: percentual.toFixed(2) // Atualiza o campo % automaticamente
  }, { emitEvent: false }); 
}


calculaDescontoPercentual() {
  const valor_totalBruto = parseFloat(this.formulario.get('totalbruto')?.value) || 0;
  let percentual_desconto = (parseFloat(this.formulario.get('desconto')?.value) * 0.01) || 0;
  
  // Calcula o valor do desconto e converte para número após o toFixed
  const valor_desconto = parseFloat((valor_totalBruto * percentual_desconto).toFixed(2));
  
  // Subtrai o desconto do valor bruto para obter o total líquido
  const total_liquido = (valor_totalBruto - valor_desconto).toFixed(2);

  // Define o valor de `totaliq` com o total líquido formatado para duas casas decimais
  this.formulario.get('totaliq')?.setValue(total_liquido);
  this.formulario.get('valordesconto')?.setValue("0");  // zera o desconto de valor
  this.formulario.get('valordesconto')?.setValue(valor_desconto.toFixed(2));
}

calculaPercentualPeloValorDesconto(){

   const valor_totalBruto = parseFloat(this.formulario.get('totalbruto')?.value) || 0;
  let percentual_desconto = (parseFloat(this.formulario.get('desconto')?.value) * 0.01) || 0;
  
  // Calcula o valor do desconto e converte para número após o toFixed
  const valor_desconto = parseFloat((valor_totalBruto * percentual_desconto).toFixed(2));
  
  // Subtrai o desconto do valor bruto para obter o total líquido
  const total_liquido = (valor_totalBruto - valor_desconto).toFixed(2);
if (valor_totalBruto > 0) {
  const percentual = (valor_desconto / valor_totalBruto) * 100;
  console.log(" valor bruto maior que zero")
  // Acesso direto via objeto 'controls'
  this.formulario.controls['desconto'].setValue(percentual.toFixed(2));
} else {
  this.formulario.controls['desconto'].setValue("0.00");
}
  }



///////////////////////////////////ATUALIZA ORDEM DE SERVIÇO////////////////////////////////////////

atualizarOS() {
      
      ///VALIDA TÉCNICO E TAREFA EXECUTADA 1////////////
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
      this.exibirAlertErroValidacao = true;
        return; // Interrompe a execução se houver campos obrigatórios inválidos
    }


    ////VALIDA SE O STATUS DA OS FOI ALTERADO:
    if (!this.monitoraMudancaSelectStatus) {
      this.exibeMensagemErroValidacao = true;
      this.exibirAlertErroValidacao = true;
      return
    }

  this.geraObjetoOs();

  ////testa se é venda de bateria  e se tarefa1 é venda de bateria

  if(this.os.equipamento === 'BATERIA' && this.os.tarefa1 !== 'VENDA BATERIA'  && this.os.valorassistencia === "0.00"){
    alert(" Você está vendendo bateria avulsa e não setou Tarefa 1 como venda Bateria!")
    return
  }


  this.exibeMensagemErroValidacao = false;
  console.log(" obejeto que será enviado para service" + this.os)
  console.log("este é o objeto que será enviao para o service: ", JSON.stringify(this.os, null, 2));
  
  const id = this.os.os;
  // Chama o serviço para atualizar a OS no servidor
  this.servico.atualizarOrdemServico(id, this.os).subscribe({
    next: (osAtualizado) => {
      this.exibirAlertOsSalva = true;
      console.log("Ordem de serviço atualizada com sucesso:", osAtualizado);
      this.exibirTextoOssalva = true;
      this.exibirBotaoImprimir = true;
      this.osSalvaFechada = this.statusFechada(this.os.status);
    },
    error: (erro) => {
      console.error("Erro ao atualizar a ordem de serviço:", erro);
    }
  });

  /////SE O STATUS ESTIVER COMO FECHADA, INSERE A OS NA TABELA DO FINANCEIRO, COM O STATUS GERAL "NAO FATURADO"
if (this.os.status === "FECHADA" && Number(this.os.totaliq) > 0) {
  console.log("Enviando para financeiro a os ", this.os.os)
  this.enviaParaFinanceiro(this.os);
}

}

// ////// PREVINE QUE OCORRA UM SUBMITE SE TECLAR ENTER
preventSubmit(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
}


geraObjetoOs() {
  // Obtém a data do formulário no formato "dd-MM-yyyy"
  const dataOrcaFormulario = this.formulario.value.dataorca;
  
  let dataOrcaFinalFormatada = "";
  if (dataOrcaFormulario) {
      // Verifica se a data é válida antes de criar o objeto Date
      const partesData = dataOrcaFormulario.split('-'); // ["dd", "MM", "yyyy"]
      if (partesData.length !== 3) {
          console.error("Data de orçamento inválida:", dataOrcaFormulario);
          return; // Saia da função se o formato estiver incorreto
      }
    
      // Cria a data no formato correto
      const dataOrcaFormatada = new Date(`${partesData[2]}-${partesData[1]}-${partesData[0]}T00:00:00`);
      
      if (isNaN(dataOrcaFormatada.getTime())) {
          console.error("Data de orçamento inválida:", dataOrcaFormulario);
          return; // Saia da função se a data for inválida
      }
    
      dataOrcaFinalFormatada = dataOrcaFormatada.toISOString().slice(0, -1); // Remove o "Z"
  }

  // Repita o mesmo processo para a data de fechamento
  const dataFechamentoFormulario = this.formulario.value.fechamento;
  
  let dataFechamentoFinalFormatada = "";
  if (dataFechamentoFormulario) {
      const partesFechamentoData = dataFechamentoFormulario.split('-'); // ["dd", "MM", "yyyy"]
      if (partesFechamentoData.length !== 3) {
          console.error("Data de fechamento inválida:", dataFechamentoFormulario);
          return; // Saia da função se o formato estiver incorreto
      }
  
      const dataFechamentoFormatada = new Date(`${partesFechamentoData[2]}-${partesFechamentoData[1]}-${partesFechamentoData[0]}T00:00:00`);
  
      if (isNaN(dataFechamentoFormatada.getTime())) {
          console.error("Data de fechamento inválida:", dataFechamentoFormulario);
          return; // Saia da função se a data for inválida
      }
  
      dataFechamentoFinalFormatada = dataFechamentoFormatada.toISOString().slice(0, -1);
  }
  
  // Cria o objeto `Os`, formatando os atributos conforme necessário
  this.os = {
      ...this.os,
      //fantasia: String(this.formulario.value.fantasia || ""),
      status: String(this.formulario.value.status || ""),
      tecnico: String(this.formulario.value.tecnico || ""),
      tarefa1: String(this.formulario.value.tarefa1 || ""),
      tarefa2: String(this.formulario.value.tarefa2 || ""),
      tarefa3: String(this.formulario.value.tarefa3 || ""),
      obs3: String(this.formulario.value.obs3 || ""),
      valorassistencia: String(parseFloat(this.formulario.value.valorassistencia || "0").toFixed(2)),
      baterias: String(this.formulario.value.baterias || ""),
      qt1: String(this.formulario.value.qt1 || ""),
      valorunit1: String(parseFloat(this.formulario.value.valorunit1 || "0").toFixed(2)),
      valortotal1: String(this.formulario.get('valortotal1')?.value),
      material2: String(this.formulario.value.material2 || ""),
      qt2: String(this.formulario.value.qt2 || ""),
      valorunit2: String(parseFloat(this.formulario.value.valorunit2 || "0").toFixed(2)),
      valortotal2: String(this.formulario.get('valortotal2')?.value),
      material3: String(this.formulario.value.material3 || ""),
      qt3: String(this.formulario.value.qt3 || ""),
      valorunit3: String(parseFloat(this.formulario.value.valorunit3 || "0").toFixed(2)),
      valortotal3: String(this.formulario.get('valortotal3')?.value),
      outrositens: String(this.formulario.value.outrositens || ""),
      qtoutrositens: String(this.formulario.value.qtoutrositens || ""),
      valorunitoutrositens: String(parseFloat(this.formulario.value.valorunitoutrositens || "0").toFixed(2)),
      valortotaloutrositens: String(this.formulario.get('valortotaloutrositens')?.value),
      qtdeslocamento: String(this.formulario.value.qtdeslocamento || ""),
      valorunitariodeslocamento: String(parseFloat(this.formulario.value.valorunitariodeslocamento || "0").toFixed(2)),
      valortotaldeslocamento: String(this.formulario.get('valortotaldeslocamento')?.value),
      totalbruto: String(this.formulario.get('totalbruto')?.value),
      valordesconto: String(parseFloat(this.formulario.value.valordesconto|| "0").toFixed(2)),
      desconto: String(this.formulario.get('desconto')?.value),
      totaliq: String(this.formulario.get('totaliq')?.value),
      fechamento: String(dataFechamentoFinalFormatada || ""),
      dataorca: String(dataOrcaFinalFormatada || ""),
  };
}

gerarPDF() {
  this.exibirImpOs = true;
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

        this.exibirImpOs = false;

      });
    } else {
      console.error('Elemento para gerar o PDF não encontrado.');
    }
  }, 500); // Espera de 1 segundo
}

enviaParaFinanceiro(os: Os) {
  const dadosParaEnviar: Financeiro = {
    ...this.modeloFinanceiro,
    os: Number(os.os),
    dataEntrada: os.data ? String(os.data).split('T')[0] : '',
    fantasia: os.fantasia ? String(os.fantasia).toUpperCase() : '',
    codcli: Number(os.codcli),
    equipamento: os.equipamento ? String(os.equipamento).toUpperCase() : '',
    marca: os.marca ? String(os.marca).toUpperCase() : '',
    modelo: os.modelo ? String(os.modelo).toUpperCase() : '',
    totaliq: String(os.totaliq),
    fechamento: os.fechamento ? String(os.fechamento).split('T')[0] : '',
    statusGeral: "NAO FATURADO"
  };

  if (this.os.os) {
    this.financeiroService.deleteOsDoFinanceiro(this.os.os).pipe(
      // Captura o erro caso a OS não exista no banco (registro novo)
      catchError((err) => {
        console.log("OS não encontrada para deletar (é um registro novo). Prosseguindo...");
        // 'of(null)' finge que deu tudo certo e libera a continuação do fluxo
        return of(null);
      }),
      // Executa o POST somente após a resposta do DELETE (com sucesso ou erro tratado)
      switchMap(() => {
        console.log("Iniciando a persistência no financeiro...");
        return this.financeiroService.CadastrarOsFechadaNoFinanceiro(dadosParaEnviar);
      })
    ).subscribe({
      next: (res) => {
        this.exibirAlertOsSalva = true;
        console.log("Salvo no financeiro com sucesso:", res);
      },
      error: (err) => {
        console.error("Erro crítico na persistência do financeiro:", err);
      }
    });
  } else {
    this.financeiroService.CadastrarOsFechadaNoFinanceiro(dadosParaEnviar).subscribe({
      next: (res) => {
        this.exibirAlertOsSalva = true;
        console.log("Salvo diretamente sem ID de OS:", res);
      },
      error: (err) => console.error("Erro ao cadastrar diretamente:", err)
    });
  }
}

}



