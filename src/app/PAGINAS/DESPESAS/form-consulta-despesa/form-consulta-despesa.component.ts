import { Component } from '@angular/core';
import { DespesaService } from '../../../servico/despesa.service';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Despesa } from '../../../modelo/Despesa';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConsultaDespesa } from '../../../modelo/ConsultaDespesa';

@Component({
  selector: 'app-form-consulta-despesa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgbDatepickerModule, FormsModule],
  templateUrl: './form-consulta-despesa.component.html',
  styleUrl: './form-consulta-despesa.component.css'
})
export class FormConsultaDespesaComponent {
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
    dadosConsultaFiltro: Despesa[] = [];
    categoriaSelecionada: string = "TODOS";
    statusSelecionado: string = "TODOS";
    formularioDespesaAvulsa!: FormGroup;
    novaDespesa: Despesa = null; 
    totalGeral: number = 0;
    totalApagar: number = 0;
    totalPago: number = 0;
    valorGeral: number = 0;
    valorTotalApagar: number = 0;
    valorTotalPago: number = 0;
    valorTotalEmpresa: number = 0;
    valorTotalCasa: number = 0;
  
  
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
  
      console.log(" Este é dia ", dia)
  
      this.dataInicialIntervalo = `${ano}-${mes}-${dia}`; 
      console.log('Data salva como string:', this.dataInicialIntervalo);
    }
  
     onDateFinal(date: NgbDateStruct) {
      // Formato Brasileiro: DD/MM/AAAA
      const dia = date.day.toString().padStart(2, '0');
      const mes = date.month.toString().padStart(2, '0');
      const ano = date.year;
      
      this.dataFinalIntervalo = `${ano}-${mes}-${dia}`; 
      console.log('Data salva como string:', this.dataFinalIntervalo);
    }

    // No seu componente .ts

onCategoria(event: any) {
  this.categoriaSelecionada = event.target.value;
  console.log("Categoria selecionada (via evento):", this.categoriaSelecionada);
}

onStatus(event: any) {
  this.statusSelecionado = event.target.value;
  console.log("Categoria selecionada (via evento):", this.statusSelecionado);
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
        this.exibirTabelaDespesas = false
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
          this.exibirTabelaDespesas = false;
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

  consultarDespesasComFiltro() {
  // 1. Validação prévia dos campos obrigatórios
  if (!this.dataInicialIntervalo || !this.dataFinalIntervalo || !this.categoriaSelecionada || !this.statusSelecionado) {
    alert("Por favor, preencha todos os filtros (Datas, Categoria e Status).");
    return;
  }

  this.despesaService?.consultarDespesasFiltro(
    this.dataInicialIntervalo, 
    this.dataFinalIntervalo, 
    this.categoriaSelecionada, 
    this.statusSelecionado
  ).subscribe({
    next: (dados: Despesa[]) => {
      // 2. Verificação de conteúdo vazio
      if (!dados || dados.length === 0) {
        this.dadosConsultaFiltro = [];
        alert("Nenhuma despesa encontrada com os filtros aplicados.");
      } else {
        this.dadosConsultaFiltro = dados;
        console.log("Busca filtrada realizada com sucesso:", this.dadosEntreIntervalo);
        
        // Mantendo a lógica de exibição do seu padrão
        this.exibirTabelaDespesas = true;
        this.calcularValorTotal();
        this.calcularValorApagar();
        this.calcularValorPago();
        this.calcularValorEmpresa();
        this.calcularValorCasa();
      }
    },
    error: (err) => {
      // 3. Tratamento de erro técnico
      console.error("Erro ao buscar despesas filtradas:", err);
      
      let mensagemErro = "Ocorreu um erro ao consultar os dados com filtros.";
      
      if (err.status === 0) {
        mensagemErro = "Não foi possível conectar ao servidor. Verifique sua conexão.";
      } else if (err.status === 404) {
        mensagemErro = "Nenhum registro encontrado para os critérios selecionados.";
      }
      
      alert(mensagemErro);
    },
    complete: () => {
      console.log("Consulta por filtro finalizada.");
    }
  });
}

calcularValorTotal(): void {
  this.valorGeral = 0;
  this.valorGeral = this.dadosConsultaFiltro.reduce((acumulador, item) => {
    // Converte string para número (substitui vírgula por ponto se necessário)
    const valorNumerico = parseFloat(item.valor.replace(',', '.'));
    
    // Soma apenas se for um número válido, senão soma 0
    return acumulador + (isNaN(valorNumerico) ? 0 : valorNumerico);
  }, 0);

  console.log("Este é o valor geral", this.valorGeral)
}


calcularValorApagar(): void {
  this.valorTotalApagar = this.dadosConsultaFiltro.reduce((acumulador, item) => {
    // 1. Verifica se o status é exatamente 'A PAGAR'
    if (item.status === 'A PAGAR') {
      // 2. Converte a string para número
      const valorNumerico = parseFloat(item.valor.replace(',', '.'));
      
      // 3. Soma apenas se for um número válido
      return acumulador + (isNaN(valorNumerico) ? 0 : valorNumerico);
    }
    
    // Se o status não for 'A PAGAR', mantém o valor acumulado anterior
    return acumulador;
  }, 0);

  console.log("Este é o valor total a pagar:", this.valorTotalApagar);
}

calcularValorPago(): void {
  this.valorTotalPago = this.dadosConsultaFiltro.reduce((acumulador, item) => {
    if (item.status === 'PAGO') {
      const valorNumerico = parseFloat(item.valor.replace(',', '.'));
      return acumulador + (isNaN(valorNumerico) ? 0 : valorNumerico);
    }
    return acumulador;
  }, 0);
  console.log("Este é o valor total pago:", this.valorTotalPago);
}

calcularValorEmpresa(): void {
  this.valorTotalEmpresa = this.dadosConsultaFiltro.reduce((acumulador, item) => {
    if (item.categoria === 'ADMINISTRATIVA' || item.categoria ==='ALUGUEL' || item.categoria === 'BANCARIA' || item.categoria === 'BATERIA' || item.categoria === 'IMPOSTOS' || item.categoria === 'INSUMOS' || item.categoria === 'SALARIO' || item.categoria === 'VEICULO') {
      const valorNumerico = parseFloat(item.valor.replace(',', '.'));
      console.log(item.categoria)
      return acumulador + (isNaN(valorNumerico) ? 0 : valorNumerico);
    }
    return acumulador;
  }, 0);
  console.log("Este é o valor total Empresa:", this.valorTotalEmpresa);
}

calcularValorCasa(): void {
  this.valorTotalCasa = this.dadosConsultaFiltro.reduce((acumulador, item) => {
    if (item.categoria === 'CASA' || item.categoria ==='IGREJA') {
      const valorNumerico = parseFloat(item.valor.replace(',', '.'));
      console.log(item.categoria)
      return acumulador + (isNaN(valorNumerico) ? 0 : valorNumerico);
    }
    return acumulador;
  }, 0);
  console.log("Este é o valor total Empresa:", this.valorTotalCasa);
}





  

}
