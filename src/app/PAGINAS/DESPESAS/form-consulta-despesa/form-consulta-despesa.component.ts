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
    exibirFormularioAlterarDespesa: boolean = false
    exibirTotalizadores: boolean = false;
   
  
  configuraFormulário(){
  this.formularioDespesaAvulsa = new FormGroup({
      ID:new FormControl('', Validators.required),
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
          this.exibirTotalizadores = true;
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

  console.log("Esta é a categoria selecionada:  ", this.categoriaSelecionada)

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
        this.exibirTotalizadores = true;
        this.exibirTabelaDespesas = true;
        this.calcularValorTotal();
        this.calcularValorApagar();
        this.calcularValorPago();
        this.calcularValorEmpresa();
        this.calcularValorCasa();
        this.alertaSobreValorZerado();
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
    }
  });
}

calcularValorTotal(): void {
  this.valorGeral = 0;
  this.valorGeral = this.dadosConsultaFiltro.reduce((acumulador, item) => {
    let valorNum = item.valor;

    if (typeof valorNum === 'string') {
      valorNum = valorNum.trim();

      // Se tem vírgula, o ponto obrigatoriamente é milhar (Ex: 1.136,66 ou 820,93)
      if (valorNum.includes(',')) {
        valorNum = valorNum.replace(/\./g, '').replace(',', '.');
      } 
      // Se SÓ tem ponto, checa se é milhar (Ex: 1.500 com 3 dígitos após o ponto)
      else if (valorNum.includes('.')) {
        const partes = valorNum.split('.');
        if (partes && partes[partes.length - 1].length === 3) {
          valorNum = valorNum.replace(/\./g, '');
        }
      }
    }

    // Converte para número de forma segura e garante zero se inválido
    const valorNumerico = parseFloat(valorNum) || 0;
    
    return acumulador + valorNumerico;
  }, 0);
}



calcularValorApagar(): void {
  this.valorTotalApagar = this.dadosConsultaFiltro.reduce((acumulador, item) => {
    // 1. Verifica se o status é exatamente 'A PAGAR'
    if (item.status === 'A PAGAR') {
      let valorNum = item.valor;

      if (typeof valorNum === 'string') {
        valorNum = valorNum.trim();

        // Se tem vírgula, o ponto obrigatoriamente é milhar (Ex: 1.136,66 ou 820,93)
        if (valorNum.includes(',')) {
          valorNum = valorNum.replace(/\./g, '').replace(',', '.');
        } 
        // Se SÓ tem ponto, checa se é milhar (Ex: 1.500 com 3 dígitos após o ponto)
        else if (valorNum.includes('.')) {
          const partes = valorNum.split('.');
          if (partes && partes[partes.length - 1].length === 3) {
            valorNum = valorNum.replace(/\./g, '');
          }
        }
      }

      // 2. Converte para número de forma segura e garante zero se inválido
      const valorNumerico = parseFloat(valorNum) || 0;
      
      // 3. Soma o valor numérico tratado
      return acumulador + valorNumerico;
    }
    
    // Se o status não for 'A PAGAR', mantém o valor acumulado anterior
    return acumulador;
  }, 0);
}


calcularValorPago(): void {
  this.valorTotalPago = this.dadosConsultaFiltro.reduce((acumulador, item) => {
    if (item.status === 'PAGO') {
      let valorNum = item.valor;

      if (typeof valorNum === 'string') {
        valorNum = valorNum.trim();

        // Se tem vírgula, o ponto obrigatoriamente é milhar (Ex: 1.136,66 ou 820,93)
        if (valorNum.includes(',')) {
          valorNum = valorNum.replace(/\./g, '').replace(',', '.');
        } 
        // Se SÓ tem ponto, checa se é milhar (Ex: 1.500 com 3 dígitos após o ponto)
        else if (valorNum.includes('.')) {
          const partes = valorNum.split('.');
          if (partes && partes[partes.length - 1].length === 3) {
            valorNum = valorNum.replace(/\./g, '');
          }
        }
      }

      const valorNumerico = parseFloat(valorNum) || 0;
      return acumulador + valorNumerico;
    }
    return acumulador;
  }, 0);
}

calcularValorEmpresa(): void {
  // Lista de categorias permitidas para facilitar a leitura e manutenção
  const categoriasPermitidas = [
    'ADMINISTRATIVA', 'ALUGUEL', 'BANCARIA', 'BATERIA', 
    'IMPOSTO', 'INSUMOS', 'SALARIO', 'VEICULO', 'EMPRESTIMO'
  ];

  this.valorTotalEmpresa = this.dadosConsultaFiltro.reduce((acumulador, item) => {
    // Verifica se a categoria do item está na lista permitida
    if (categoriasPermitidas.includes(item.categoria)) {
      let valorNum = item.valor;

      if (typeof valorNum === 'string') {
        valorNum = valorNum.trim();

        // 1. Se tem vírgula, o ponto obrigatoriamente é milhar (Ex: 1.136,66 ou 820,93)
        if (valorNum.includes(',')) {
          valorNum = valorNum.replace(/\./g, '').replace(',', '.');
        } 
        // 2. Se SÓ tem ponto, checa se é milhar (Ex: 1.500) ou decimal (Ex: 820.93)
        else if (valorNum.includes('.')) {
          const partes = valorNum.split('.');
          // Se o último bloco tiver exatamente 3 dígitos após o ponto, trata-se de milhar puro
          if (partes && partes[partes.length - 1].length === 3) {
            valorNum = valorNum.replace(/\./g, '');
          }
        }
      }

      // Converte para número de forma segura
      const valorFinal = parseFloat(valorNum) || 0;
      return acumulador + valorFinal;
    }
    
    return acumulador;
  }, 0);
}


calcularValorCasa(): void {
  this.valorTotalCasa = this.dadosConsultaFiltro.reduce((acumulador, item) => {
    if (item.categoria === 'CASA' || item.categoria === 'IGREJA') {
      let valorNum = item.valor;

      if (typeof valorNum === 'string') {
        valorNum = valorNum.trim();

        // Se tem vírgula, o ponto obrigatoriamente é milhar (Ex: 1.136,66 ou 820,93)
        if (valorNum.includes(',')) {
          valorNum = valorNum.replace(/\./g, '').replace(',', '.');
        } 
        // Se SÓ tem ponto, checa se é milhar (Ex: 1.500 com 3 dígitos após o ponto)
        else if (valorNum.includes('.')) {
          const partes = valorNum.split('.');
          if (partes && partes[partes.length - 1].length === 3) {
            valorNum = valorNum.replace(/\./g, '');
          }
        }
      }

      const valorNumerico = parseFloat(valorNum) || 0;
      return acumulador + valorNumerico;
    }
    return acumulador;
  }, 0);
}


alterarDespesa(dados: Despesa) {
  console.log("Estes são os dados da linha", dados);

  // 1. Tratamento da data para o NgbDatepicker (aaaa-mm-dd para objeto)
  const data = new Date(dados.vencimento);
  const dataFormatada = {
    year: data.getFullYear(),
    month: data.getMonth() + 1, // Jan é 0 no JS, mas 1 no Datepicker
    day: data.getDate() + 1
  };

  // 2. Populando o formulário
  this.formularioDespesaAvulsa.patchValue({
    ID: dados.id,
    descricao: dados.descricao,
    categoria: dados.categoria,
    status: dados.status,
    valor: dados.valor,
    vencimento: dataFormatada // Seta o objeto tratado para o datepicker
  });

  this.exibirFormularioAlterarDespesa = true;
  this.exibirTabelaDespesas = false;
  this.exibirTotalizadores = false;
}

salvarAlteracaoDespesa() {
  // 1. Extrair os dados (usando getRawValue caso o ID esteja desabilitado)
  const formValues = this.formularioDespesaAvulsa.getRawValue();

  // 2. Formatar a data do NgbDatepicker (objeto -> string)
  const data = formValues.vencimento;
  const dataFormatada = `${data.year}-${String(data.month).padStart(2, '0')}-${String(data.day).padStart(2, '0')}`;

  // 3. Montar o objeto para a API
  const despesaAtualizada: Despesa = {
    id: formValues.ID,
    descricao: formValues.descricao,
    categoria: formValues.categoria,
    vencimento: dataFormatada,
    valor: formValues.valor,
    status: formValues.status,
    iniciomes: "NAO" // Valor fixo conforme seu exemplo
  };

  // 4. Chamar o Service
  this.despesaService.atualizarDespesa(despesaAtualizada.id!, despesaAtualizada).subscribe({
    next: (res) => {
      console.log("Despesa atualizada com sucesso!", res);
      alert("Despesa atualizada com sucesso!");
      
      // 5. Limpar formulário e atualizar lista (se necessário)
      this.formularioDespesaAvulsa.reset();
      this.consultarDespesasComFiltro(); // Método que você usa para recarregar a tabela
    },
    error: (err) => {
      console.error("Erro ao atualizar despesa", err);
      alert("Erro ao salvar as alterações.");
    }
  });
  this.exibirFormularioAlterarDespesa = false;
}

reiniciarPagina(): void {
    window.location.reload();
  }

  // Variável global no componente para armazenar o ID selecionado
idParaDeletar: number | null = null;

// 1. Método chamado pelo botão TRASH na tabela
prepararParaDeletar(id: number) {
  this.idParaDeletar = id;
}

// 2. Método chamado pelo botão "Apagar Despesa" dentro do MODAL
apagarDespesa() {
  if (this.idParaDeletar) {
    this.despesaService.deleteDespesa(this.idParaDeletar).subscribe({
      next: () => {
        console.log("Despesa apagada com sucesso");
        
        // Fecha o modal via código ou apenas limpa os dados
        this.idParaDeletar = null;
        
        // Atualiza a lista da tabela
        this.consultarDespesasComFiltro()
        
        // Fecha o modal manualmente se necessário ou via data-bs-dismiss no HTML
        alert("Despesa excluída permanentemente.");
      },
      error: (err) => {
        console.error("Erro ao apagar despesa", err);
        alert("Não foi possível excluir a despesa.");
      }
    });
  }
}

// No seu arquivo .ts
alertaSobreValorZerado(): void {
  const temValorZerado = this.dadosConsultaFiltro.some(dado => dado.valor === "0,00");
  if (temValorZerado) {
    alert("Cuidado!!! Existe pelo menos uma despesa com valor zerado!")
  }
}

}
