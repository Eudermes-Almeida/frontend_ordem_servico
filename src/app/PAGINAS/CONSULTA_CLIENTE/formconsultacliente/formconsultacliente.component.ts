import { Component } from '@angular/core';
import { ParametrosCombobox } from '../../../modelo/ParametrosCombobox';
import { ParametrosService } from '../../../servico/parametros.service';
import { OrdemservicoService } from '../../../servico/ordemservico.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from '../../../modelo/Cliente';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-formconsultacliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './formconsultacliente.component.html',
  styleUrls: ['./formconsultacliente.component.css'] // Corrigido 'styleUrl' para 'styleUrls'
})
export class FormconsultaclienteComponent {

  cidades: ParametrosCombobox[] = [];
  cidadeSelecionada: string = "";
  cidadesPosicaoZero: any = { id: 100, parametro: 'SEGMENTO', valor: 'CIDADES' }; // para não iniciar com um nome de cidade e sim "cidades"

  segmentos: ParametrosCombobox[] = [];
  segmentoSelecionado: string = "";
  segmentosPosicaoZero: any = { id: 100, parametro: 'SEGMENTO', valor: 'SEGMENTOS' };

  cliente: Cliente = new Cliente();
  novocliente: number = 0;
  ultimoCliente: number = 0;
  objetocliente: Cliente[] = [];

  ultimaOs: number = 0;

  // CONFIGURA FORMULÁRIO
  formulario = new FormGroup({
    codcli: new FormControl(''),
    nomefantasia: new FormControl('', Validators.required),
    razaosocial: new FormControl('', Validators.required),
    tipo: new FormControl('', Validators.required),
    cpfcnpj: new FormControl(''),
    contato: new FormControl('', Validators.required),
    ruanum: new FormControl('', Validators.required),
    num: new FormControl(''),
    bairro: new FormControl('', Validators.required),
    cidade: new FormControl('', Validators.required),
    cep: new FormControl(''),
    fonefixo: new FormControl(''),
    fone: new FormControl('', Validators.required),
    celular2: new FormControl(''),
    email: new FormControl(''),
    segmento: new FormControl('', Validators.required),
    inscestadual: new FormControl(''),
  });

  constructor(
    private router: Router,
    private parametrosService?: ParametrosService, 
    private servico?: OrdemservicoService,
    
  ) {}

  // CONFIGURA AS FUNÇÕES QUE SERÃO EXECUTADAS NA INICIALIZAÇÃO DA PÁGINA
  ngOnInit(): void {
    if (this.parametrosService) {
      this.buscarCidades();
      this.buscarSegmentos();
      this.ativarFullscreen();
    }

    

    // Escutar mudanças no campo de nomefantasia
    this.formulario.get('nomefantasia')?.valueChanges.subscribe((value: string) => {
      if (value && value.length >= 4) {
        this.buscarClientesPorNomeFantasia(); // Dispara a busca quando atingir 4 ou mais caracteres
      }
    });

    // Escutar mudanças no campo de razaosocial
    this.formulario.get('razaosocial')?.valueChanges.subscribe((value: string) => {
      if (value && value.length >= 4) {
        this.buscarClientesPorRazaoSocial(); // Dispara a busca quando atingir 4 ou mais caracteres
      }
    });
  }


  //escuta o input codcli ser ativado com a tecla enter:
  onClienteKey(event: KeyboardEvent): void {
    const input = (event.target as HTMLInputElement).value;

    if (event.key === 'Enter') { // Dispara a busca ao digitar 4 algarismos
      const id = parseInt(input, 10); // Converte o valor para número
      this.getCliente(id); // Chama o método getCliente com o valor digitado
    }
  }

  ///ATIVAR FULL SCREEN:
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



  // Buscar clientes por Razao Social
  buscarClientesPorRazaoSocial(): void {
    const razaoSocial = this.formulario.get('razaosocial')?.value;

    if (razaoSocial && razaoSocial.length >= 4) {
      this.servico?.getClientesPorRazaoSoocial(razaoSocial).subscribe(
        (dados: Cliente[]) => {
          this.objetocliente = dados; // Armazena os clientes retornados
          console.log('Clientes encontrados:', this.objetocliente);
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
    const nomefantasia = this.formulario.get('nomefantasia')?.value;

    if (nomefantasia && nomefantasia.length >= 4) {
      this.servico?.getClientesPorNomeFantasia(nomefantasia).subscribe(
        (dados: Cliente[]) => {
          this.objetocliente = dados; // Armazena os clientes retornados
          console.log('Clientes encontrados:', this.objetocliente);
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

  buscarSegmentos(): void {
    this.parametrosService?.getSegmentos().subscribe(
      (dados: ParametrosCombobox[]) => {
        this.segmentos = dados;
        this.segmentos.unshift(this.segmentosPosicaoZero);
        console.log(this.segmentos);
      },
      (erro) => {
        console.error('Erro ao buscar segmentos:', erro);
      }
    );
  }

  // ESCUTA O SELECT CIDADES - QUANDO ELE É ACIONADO, COLOCA O VALOR DELE EM "CIDADE SELECIONADA"
  onCityChange(event: Event): void {
    this.cidadeSelecionada = (event.target as HTMLSelectElement).value; // Atualiza a cidade selecionada
    this.getClientePorCidade(this.cidadeSelecionada);  // Chama o método para buscar clientes pela cidade
  }

  onSegmentoChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.segmentoSelecionado = selectElement.value;
  }

  // Busca Clientes por cidade
  getClientePorCidade(cidade: string): void {
    this.servico.getClientesPorCidade(cidade).subscribe(
      (data: Cliente[]) => { // Espera um array de clientes
        this.objetocliente = data; // Armazena todos os clientes retornados
        console.log('Clientes obtidos:', this.objetocliente);
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

  
  buscaUltimocliente(codigoClienteInput: HTMLInputElement): void {
    this.servico?.ultimocliente().subscribe({
      next: (retorno: number) => {
        this.ultimoCliente = retorno;
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
  
  

  escreveconsole() {
    this.cliente.id = this.novocliente.toString();
    this.cliente.nomefantasia = this.formulario.value.nomefantasia!;
    this.cliente.razaosocial = this.formulario.value.razaosocial!;
    this.cliente.tipo = this.formulario.value.tipo!;
    this.cliente.cpfcnpj = this.formulario.value.cpfcnpj!;
    this.cliente.contato = this.formulario.value.contato!;
    this.cliente.ruanum = this.formulario.value.ruanum!;
    this.cliente.num = this.formulario.value.num!;
    this.cliente.bairro = this.formulario.value.bairro!;
    this.cliente.cidade = this.cidadeSelecionada; // Utiliza a cidade selecionada
    this.cliente.cep = this.formulario.value.cep!;
    this.cliente.fonefixo = this.formulario.value.fonefixo!;
    this.cliente.fone = this.formulario.value.fone!;
    this.cliente.celular2 = this.formulario.value.celular2!;
    this.cliente.email = this.formulario.value.email!;
    this.cliente.segmento = this.segmentoSelecionado; // Utiliza o segmento selecionado
    this.cliente.inscestadual = this.formulario.value.inscestadual!;
    
    console.log("Cliente a ser cadastrado:", this.cliente);
  }

  idSelecionado:string;

  capturaId(id: string) {
    this.idSelecionado = id; // Armazena o valor do id
    console.log('ID capturado:', this.idSelecionado); // Apenas para verificar se está funcionando
  }


  buscaUltimaOs( ): void {
    this.servico?.ultimaOs().subscribe({
      next: (retorno: number) => {
        this.ultimaOs = retorno;
        console.log("Este é a última os " + this.ultimaOs);
        
        
      },
      error: (err) => {
        console.error('Erro ao buscar o último cliente:', err);
        alert('Ocorreu um erro durante a busca do código do novo cliente. O Novo cliente NÃO foi cadastrado');
      }
    });
  }

  limpar() {
    // Navega para a primeira rota
    this.router.navigate(['/home']).then(() => {
      // Após a navegação para 'home', navega para 'parametros'
      this.router.navigate(['cliente/consulta']);
    });
  }

}
