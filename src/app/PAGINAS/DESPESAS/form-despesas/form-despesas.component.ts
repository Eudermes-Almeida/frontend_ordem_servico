import { DespesaService } from './../../../servico/despesa.service';

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Despesa } from '../../../modelo/Despesa';
import { FormControl, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-form-despesas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgbDatepickerModule, FormsModule],
  templateUrl: './form-despesas.component.html',
  styleUrl: './form-despesas.component.css'
})
export class FormDespesasComponent {

  ngOnInit() {
    this.configuraFormulário();
  }

  constructor(private despesaService: DespesaService){}

  // ADICIONE ESTA LINHA AQUI:
  model: NgbDateStruct | undefined; 
  model2: NgbDateStruct | undefined; 
  model3: NgbDateStruct | undefined; 

  dataInicial: string = "";
  dataFinal: string = "";
  dataInicialIntervalo: string;
  dataFinalIntervalo: string
  dataVencimento: string = "";
  dadosInicioMes: Despesa[] = [];
  dadosEntreIntervalo: Despesa[] = [];
  categoriaSelecionada: string = "";
  statusSelecionado: string = "";
  formularioDespesaAvulsa!: FormGroup;
  novaDespesa: Despesa = null; 


  ////CONTROLE DE RENDERIZAÇÃO:

  exibirBtnSalvar: boolean = false;
  exibirBtnConsultar: boolean = true;
  exibirBtnCadastrarDespesasAvulsas: boolean = false;
  exibirBtnIniciarMes: boolean = false;
  exibirFormDespesaAvulsa: boolean = false;
  exibirTabelaDespesas: boolean = false;
 

configuraFormulário(){
this.formularioDespesaAvulsa = new FormGroup({
    descricao:new FormControl('', Validators.required),
    categoria:new FormControl('', Validators.required),
    vencimento:new FormControl('', Validators.required),
    valor:new FormControl('', Validators.required),
    status:new FormControl('', Validators.required)
     });
}


adicionaNovaDespesa() {
  // 1. Validação básica
  if (this.formularioDespesaAvulsa.invalid) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  this.exibirTabelaDespesas = true;

  // 2. Tratamento da Data (Objeto -> String YYYY-MM-DD)
  const dt = this.formularioDespesaAvulsa.value.vencimento;
  const dataFormatada = `${dt.year}-${dt.month.toString().padStart(2, '0')}-${dt.day.toString().padStart(2, '0')}`;

  // 3. Criação do objeto respeitando o modelo Despesa
  this.novaDespesa = {
    descricao: this.formularioDespesaAvulsa.value.descricao?.toUpperCase(),
    categoria: this.formularioDespesaAvulsa.value.categoria,
    vencimento: dataFormatada, // Agora como string
    valor: this.formularioDespesaAvulsa.value.valor,
    status: this.formularioDespesaAvulsa.value.status,
    iniciomes: "NAO"
  };

  // 4. Adiciona ao array (usando push)
  this.dadosInicioMes.push(this.novaDespesa);

  console.log("Item adicionado à lista. Total de itens:", this.dadosInicioMes.length);

  // 5. Opcional: Limpar o formulário após adicionar
  this.formularioDespesaAvulsa.reset({
    categoria: '',
    status: 'A PAGAR'
  });
}


 
iniciarMes(){
  console.log(" Inicia Mes")
}

cadastrarDespesasAvulsas(){
  this.exibirFormDespesaAvulsa = true;
  this.exibirTabelaDespesas = false;
  this.dadosInicioMes = [];
}


  // Função para converter o objeto em string
  onDateInicial(date: NgbDateStruct) {
    // Formato Brasileiro: DD/MM/AAAA
    const dia = date.day.toString().padStart(2, '0');
    const mes = date.month.toString().padStart(2, '0');
    const ano = date.year;
    
    this.dataInicial = `${dia}/${mes}/${ano}`;
    this.dataInicialIntervalo = `${ano}-${mes}-${dia}`; 
    console.log('Data salva como string:', this.dataInicial);
  }

   onDateFinal(date: NgbDateStruct) {
    // Formato Brasileiro: DD/MM/AAAA
    const dia = date.day.toString().padStart(2, '0');
    const mes = date.month.toString().padStart(2, '0');
    const ano = date.year;
    
    this.dataFinal = `${dia}/${mes}/${ano}`;
    this.dataFinalIntervalo = `${ano}-${mes}-${dia}`; 
    console.log('Data salva como string:', this.dataFinal);
  }

  onDateVencimento(date: NgbDateStruct) {
    // Formato Brasileiro: DD/MM/AAAA
    const dia = date.day.toString().padStart(2, '0');
    const mes = date.month.toString().padStart(2, '0');
    const ano = date.year;
    
    this.dataVencimento = `${dia}/${mes}/${ano}`;
    console.log('Data salva como string:', this.dataVencimento);
  }


  buscarInicioMes(): void {
  this.despesaService?.getInicioMes().subscribe(
    (dados: Despesa[]) => {
      
      this.exibirTabelaDespesas = true;
      this.exibirBtnConsultar = false;
      this.exibirBtnSalvar = true;
      // 1. Extrair mês e ano da string 'dataInicial' (formato DD/MM/YYYY)
      const partesData = this.dataInicial.split('/');
      const mesSelecionado = partesData[1]; // MM
      const anoSelecionado = partesData[2]; // YYYY

      // 2. Mapear os dados alterando apenas o vencimento
      this.dadosInicioMes = dados.map(item => {
        // O vencimento original vem como "YYYY-MM-DD"
        // Extraímos apenas o dia (os últimos 2 caracteres)
        const diaOriginal = item.vencimento.split('-')[2];

        // Montamos a nova data mantendo o padrão que o Angular DatePipe entende (YYYY-MM-DD)
        const novoVencimento = `${anoSelecionado}-${mesSelecionado}-${diaOriginal}`;

        return {
          ...item,
          vencimento: novoVencimento
        };
      });

      console.log("Dados com datas atualizadas: ", this.dadosInicioMes);
    }
  );
}

enviaIncioMesCompleto() {
  // 1. Validação de lista vazia
  if (!this.dadosInicioMes || this.dadosInicioMes.length === 0) {
    alert("Não há dados para salvar.");
    return;
  }

  
  // 3. TRATAMENTO DOS DADOS ANTES DE ENVIAR
  // Forçando o tipo Despesa no retorno do map
const listaParaSalvar: Despesa[] = this.dadosInicioMes.map((item: Despesa): Despesa => {
  return {
    ...item,
    id: undefined,   // Agora o TS aceita pois o modelo Despesa permite undefined
    iniciomes: "NAO"
  };
});


  // 4. Chamada ao service enviando a lista tratada
  this.despesaService.salvarDespesasEmLote(listaParaSalvar).subscribe({
    next: (response) => {
      console.log('Lote salvo com sucesso:', response);
      alert("Todas as despesas  foram cadastradas com sucesso.");
      this.exibirBtnCadastrarDespesasAvulsas = true;
      // Opcional: Limpar a variável após o sucesso
      this.dadosInicioMes = []; 
    },
    error: (error) => {
      console.error('Erro ao salvar lote:', error);
      alert("Erro ao salvar despesas: " + (error.error || "Erro desconhecido"));
    }
  });
}

consultarDespesasNoPeriodo() {
  // 1. Validação prévia
  if (!this.dataInicialIntervalo || !this.dataFinalIntervalo) {
    alert("Por favor, selecione as datas de início e fim.");
    return;
  }

  this.despesaService?.buscaDespesasEntreDatas(this.dataInicialIntervalo, this.dataFinalIntervalo).subscribe({
    next: (dados: Despesa[]) => {
      // 2. Verificação de conteúdo vazio
      if (!dados || dados.length === 0) {
        this.dadosEntreIntervalo = [];
        alert("Nenhuma despesa encontrada para este período.");
      } else {
        this.dadosEntreIntervalo = dados;
        this.dadosInicioMes = dados;
        console.log("Busca realizada com sucesso:", this.dadosEntreIntervalo);
        this.exibirFormDespesaAvulsa = true;
        this.exibirBtnSalvar = true;
        this.dadosInicioMes = [];
      }
    },
    error: (err) => {
      // 3. Tratamento de erro técnico (Servidor fora, erro 400, 500, etc)
      console.error("Erro ao buscar despesas:", err);
      
      let mensagemErro = "Ocorreu um erro ao consultar os dados.";
      
      if (err.status === 0) {
        mensagemErro = "Não foi possível conectar ao servidor. Verifique sua conexão.";
      } else if (err.status === 404) {
        mensagemErro = "Para este mês, primeiro você terá de cadastrar as despesas recorrentes do mês.";
        this.buscarInicioMes(); ///se ao consultar intervalo de datas, vier vazio, vai inciiar rotina de inicio de mes
      }
      
      alert(mensagemErro);
    },
    complete: () => {
      // Executa algo quando a requisição termina (opcional)
      console.log("Consulta finalizada.");
    }
  });
}


}



