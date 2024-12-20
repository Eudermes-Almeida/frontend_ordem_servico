import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ParametrosCombobox } from '../../../modelo/ParametrosCombobox';
import { Cliente } from '../../../modelo/Cliente';
import { Os } from '../../../modelo/Os';
import { FormControl, FormGroup } from '@angular/forms';
import { ParametrosService } from '../../../servico/parametros.service';
import { OrdemservicoService } from '../../../servico/ordemservico.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-form-altera-os-pag1',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-altera-os-pag1.component.html',
  styleUrl: './form-altera-os-pag1.component.css'
})
export class FORMALTERAOSPAG1Component implements OnInit {
  cidades: ParametrosCombobox[] = [];
  cidadeSelecionada: string = "";
  cidadesPosicaoZero: any = { id: 100, parametro: 'SEGMENTO', valor: 'CIDADES' }; // para não iniciar com um nome de cidade e sim "cidades"

  equipamentos: ParametrosCombobox[] = [];
  equipamentoSelecionado: string = "";
  equipamentosPosicaoZero: any = { id: 100, parametro: 'EQUIPAMENTO', valor: '' }; // para não iniciar com um nome de cidade e sim "cidades"

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
  objetoOs: Os[] = [];
  ultimaOs: number = 0;
  novaOs: number = 0;

  ///////////CONTROLE DE RENDERIZAÇÃO/////////
  exibirBotaoSalvar: boolean = true;
  exibirBotaoSair: boolean = false;
  exibirTextoOsSalva: boolean = false

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
      private route: ActivatedRoute // Injeta a rota ativa
  ) {}


  ////////////////ESCUTA OS SELECT'S /////////////////////////////////////////////////
// ESCUTA O SELECT EQUIPAMENTOS
onEquipamentoChange(event: Event): void {
  this.equipamentoSelecionado = (event.target as HTMLSelectElement).value;
  console.log(this.equipamentoSelecionado);
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
  const target = event.target as HTMLSelectElement;
  if (target) {
    this.atendenteSelecionado = target.value;
    console.log("Valor selecionado:", this.atendenteSelecionado);
  } else {
    console.error("Elemento do evento não foi encontrado.");
  }
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
      this.buscarEquipamentos();
      this.buscarCor();
      this.buscarDefeitosCliente();
      this.buscarAtendente();
      this.ativarFullscreen();
    }

    // Chama o método para carregar o número da OS da URL assim que a página for carregada
    this.carregaNumOsdaUrl();
    
  }

  //////////////////CAPTURA NUM OS QUE VEIO NA URL E CHAMA FUNÇÃO PARA BUSCA O OBJETO OS //////
  carregaNumOsdaUrl(): void {
    // Captura o ID da URL
    const id = Number(this.route.snapshot.paramMap.get('os'));

    if (id) {
      // Chama a função getOsPorId com o ID capturado
      this.getOsPorId(id);
    } else {
      console.error('ID não encontrado na URL');
    }
  }

  ///////ATIVA FULL SCREEN////
  ativarFullscreen(): void {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) { /* Safari */
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) { /* IE11 */
      (elem as any).msRequestFullscreen();
    }
  }

  
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

  /////////////ESCREVE DADOS NOS INPUTS/////////////////////////////
  escreveDadosClienteNosInputs(os: Os): void {
    console.log('Dados do cliente:', os);
    console.log( "escreve atendente nos inputs " + os.atendente)

    this.os = os;  // <-- Adicione esta linha para atualizar o objeto `os`
        this.formulario.patchValue({
            os: os.os.toString(), 
            data: new Date(os.data).toLocaleDateString('pt-BR'), // Formata para 'dd/MM/yyyy'
            hora: os.hora,
            status: os.status,
            codcli: os.codcli,
            fantasia: os.fantasia,
            rzsocial: os.rzsocial,
            equipamento: os.equipamento,
            marca: os.marca,
            modelo: os.modelo, 
            topologia: os.topologia,
            cor: os.cor,
            serial: os.serial,
            patrimonio: os.patrimonio,
            obs1: os.obs1,
            obs2: os.obs2,
            defeito1: os.defeito1,
            defeito2: os.defeito2,
            venda: os.venda,
            garantia: os.garantia,
            osoriginal: os.osoriginal,
            atendente: os.atendente,
        });
  }

  // Busca ORDEM SERVIÇO por id
  getOsPorId(os: number): void {

    console.log(`Este é o num os recebido na url ${os}`)
    this.servico.getOsPorId(os).subscribe(
      (data: Os) => {
        this.objetoOs = [data]; // Coloca o cliente dentro de um array
        console.log('O.S. obtida:', this.objetoOs);
        this.servico.setOs(this.objetoOs);
        const osMemorizada = this.servico.getOs();
        console.log(" Os memorizada pelo altera pag1 " , osMemorizada); 
        this.servico.setOs(this.objetoOs); // Atualiza o estado no serviço para sincronizar com o componente time line
        this.escreveDadosClienteNosInputs(data);
      },
      (error) => {
        if (error.status === 404) {
          alert(`Você informou o código ${os}, não existe ordem de serviço para este código`);
        } else {
          console.error('Erro ao buscar cliente:', error);
          alert(`Você informou o código ${os}, não existe ordem de serviço para este código`);
        }
      }
    );
  }

  vaipag2(){
    console.log(`esta é a os: ` + this.os.os)
  }

  ///////////////////////////////////ATUALIZA ORDEM DE SERVIÇO////////////////////////////////////////

  // Método TS para atualizar a OS no banco de dados
atualizarOS() {
  // Gera o objeto OS com os dados do formulário
  this.geraObjetoOs();

  // Obtém o ID da OS que deseja atualizar (ajuste conforme a forma como obtém o ID)
  const id = this.os.os;

  // Chama o serviço para atualizar a OS no servidor
  this.servico.atualizarOrdemServico(id, this.os).subscribe({
    next: (osAtualizado) => {
      // Sucesso na atualização - você pode atualizar a interface ou redirecionar o usuário
      
      console.log("Ordem de serviço atualizada com sucesso:", osAtualizado);
      this.exibirTextoOsSalva = true;
      // Exemplo: redirecionar ou exibir uma mensagem de sucesso
    },
    error: (erro) => {
      // Erro na atualização - exibir mensagem de erro
      console.error("Erro ao atualizar a ordem de serviço:", erro);
      alert(" Erro ao atualizar ordem de serviço");
      // Exemplo: exibir uma mensagem de erro ao usuário
    }
  });
}

  //coleta os dados do formulário e fabrica o objeto
  geraObjetoOs() {

  
    // Obtém a data do formulário no formato "dd/MM/yyyy"
    const dataFormulario = this.formulario.value.data;
    // Converte a data para o formato "yyyy-MM-ddTHH:mm:ss"
    const partesData = dataFormulario.split('/'); // ["dd", "MM", "yyyy"]
    const dataFormatada = new Date(`${partesData[2]}-${partesData[1]}-${partesData[0]}T00:00:00`);
    // Ajuste para remover o "Z" e deixar a data no formato "yyyy-MM-ddTHH:mm:ss"
    const dataFinalFormatada = dataFormatada.toISOString().slice(0, -1); // Remove o "Z" para ter apenas "yyyy-MM-ddTHH:mm:ss"
    
    // Formata a hora para garantir que esteja no padrão correto
    const horaFormulario = this.formulario.value.hora;
    const partesHora = horaFormulario.split(':');
    const horaFormatada = `${partesHora[0].padStart(2, '0')}:${partesHora[1].padStart(2, '0')}:${partesHora[2].padStart(2, '0')}`;
  
    // Cria o objeto `Os`, formatando os atributos conforme necessário
    this.os = {
      ...this.os,
      data: dataFinalFormatada, // Passa a data como uma string
      hora: horaFormatada, // Já está em formato string
      fantasia: String(this.formulario.value.fantasia || ""),
      rzsocial: String(this.formulario.value.rzsocial || ""),
      codcli: String(this.formulario.value.codcli || "0"), // Converte temporariamente para string
      atendente: String(this.formulario.value.atendente || ""),
      status: String(this.formulario.value.status || ""),
      prioridade: String(this.formulario.value.prioridade || ""),
      equipamento: String(this.formulario.value.equipamento || ""),
      marca: String(this.formulario.value.marca || ""),
      modelo: String(this.formulario.value.modelo || ""),
      topologia: String(this.formulario.value.topologia || ""),
      cor: String(this.formulario.value.cor || ""),
      serial: String(this.formulario.value.serial || ""),
      patrimonio: String(this.formulario.value.patrimonio || ""),
      obs1: String(this.formulario.value.obs1 || ""),
      obs2: String(this.formulario.value.obs2 || ""),
      defeito1: String(this.formulario.value.defeito1 || ""),
      defeito2: String(this.formulario.value.defeito2 || ""),
      venda:  String(this.formulario.value.venda || ""),
      garantia:  String(this.formulario.value.garantia || ""),
      osoriginal:  String(this.formulario.value.osoriginal || ""),
    };
  }
  
}
