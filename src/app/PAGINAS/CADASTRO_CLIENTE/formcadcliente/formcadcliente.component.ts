import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from '../../../modelo/Cliente';
import { OrdemservicoService } from '../../../servico/ordemservico.service';
import { CommonModule } from '@angular/common';
import { ParametrosService } from '../../../servico/parametros.service';
import { ParametrosCombobox } from '../../../modelo/ParametrosCombobox';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-formcadcliente',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './formcadcliente.component.html',
  styleUrls: ['./formcadcliente.component.css']
})
export class FormcadclienteComponent implements OnInit {

  cidades: ParametrosCombobox[] = [];
  cidadeSelecionada: string = "";
  cidadesPosicaoZero: any = { id: 100, parametro: 'SEGMENTO', valor: '' };

  segmentos: ParametrosCombobox[] = [];
  segmentoSelecionado: string = "";
  segmentosPosicaoZero: any = { id: 100, parametro: 'SEGMENTO', valor: '' };

  tipoSelecionado: string = "";

  cep: string = "";
  resultadoCep: string = "";
  naoExisteEsteCliente: boolean = true
  clienteSalvo: boolean = false;


  exibirAlertValidacao: boolean = false;


  ////////////////////////CONTROLE DE RENDERIZAÇÃO///////////////////////
  exibirAlertClienteSalvo: boolean = false
  desabilitaBtnCadastrarCliente: boolean = true

  constructor(
    private router: Router, // Parâmetro obrigatório primeiro
    private parametrosService?: ParametrosService, // Parâmetro opcional
    private servico?: OrdemservicoService // Parâmetro opcional
  ) {}
  

  ngOnInit(): void {
    if (this.parametrosService) {
      this.buscarCidades();
      this.buscarSegmentos();
      this.controleRenderizacaoAlertInvalidacaoFormulario();
      //this.ativarFullscreen();
    }
  }

  controleRenderizacaoAlertInvalidacaoFormulario(){
    this.formulario.statusChanges.subscribe(status => {
    if (status === 'VALID') {
      this.exibirAlertValidacao = false;
    }
  });
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

  ///ESCUTA SELECT CIDADE/////////////////
  onCityChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.cidadeSelecionada = selectElement.value;
  }

  ///ESCUTA SELECT TIPO/////////////////
  onTipoChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.tipoSelecionado = selectElement.value;
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

  onSegmentoChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.segmentoSelecionado = selectElement.value;
  }

  formulario = new FormGroup({
    codcli: new FormControl(''),
    nomefantasia: new FormControl('', Validators.required),
    razaosocial: new FormControl(''),
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

  cliente: Cliente = new Cliente();
  objetocliente: Cliente[] = [];
  novocliente: number = 0;

  // Método para cadastrar cliente apenas ao clicar no botão
  cadastrarCliente(): void {
    if (this.formulario.valid) { // Verifica se o formulário é válido
      this.buscanovocliente();
    } else {
      alert('Por favor, preencha os campos obrigatórios.');
    }
  }

  async  buscanovocliente(): Promise<void> {
   await this.ConfereSeEsteClienteJaEstaNoBanco()
    if(this.naoExisteEsteCliente){
      alert("Existe um cliente já cadastrado com o NOME EXATAMENTE IGUAL a este, não é permitido cadastrar mais de um cliente com o mesmo nome")
      return
    }

    this.servico?.ultimocliente().subscribe({
      next: (retorno: number) => {
        this.novocliente = retorno + 1;
        console.log("Este é o novo cliente " + this.novocliente);
        this.escreveconsole();
        this.clienteSalvo = true;
        
      },
      error: (err) => {
        console.error('Erro ao buscar o último cliente:', err);
        alert('Ocorreu um erro durante a busca do código do novo cliente. O Novo cliente NÃO foi cadastrado');
      }
    });
  }

  
/////confere se já existe o cliente que será cadastrado no banco de dados:
async ConfereSeEsteClienteJaEstaNoBanco(): Promise<void> {

    const nomefantasia = this.formulario.get('nomefantasia')?.value;

    if (nomefantasia && nomefantasia.length >= 4) {
    try {
      // Tenta buscar o cliente
      await lastValueFrom(this.servico.getClientesPorNomeFantasia(nomefantasia));
      // Se encontrou (Sucesso/200), marcamos que JÁ EXISTE
      this.naoExisteEsteCliente = true;
    } catch (erro) {
      // Se deu erro (ex: 404), significa que NÃO EXISTE, então pode cadastrar
      this.naoExisteEsteCliente = false;
    }
  }
  }



  escreveconsole() {

     ///VALIDA FORMULÁRIO////////////
let hasInvalidFields = false;


 Object.keys(this.formulario.controls).forEach((campo) => {
 const controle = this.formulario.get(campo);
 // Verifique apenas os controles com o validador 'required'
 if (controle?.hasValidator(Validators.required) && controle.invalid) {
 controle.markAsTouched();
 hasInvalidFields = true;

} });

if(!this.formulario.value.razaosocial){
  this.formulario.value.razaosocial = this.formulario.value.nomefantasia;
  alert(" Como o campo Razão Social está vazio, ele será implementado com o valor que está em Nome Fantasia")
}

if (hasInvalidFields) {
this.exibirAlertValidacao = true;
 return; // Interrompe a execução se houver campos obrigatórios inválidos }
}
    this.cliente.id = this.novocliente.toString();
    this.cliente.nomefantasia = this.formulario.value.nomefantasia!;
    this.cliente.razaosocial = this.formulario.value.razaosocial!;
    this.cliente.tipo = this.tipoSelecionado;
    this.cliente.cpfcnpj = this.formulario.value.cpfcnpj!;
    this.cliente.contato = this.formulario.value.contato!;
    this.cliente.ruanum = this.formulario.value.ruanum!;
    this.cliente.num = this.formulario.value.num!;
    this.cliente.bairro = this.formulario.value.bairro!;
    this.cliente.cidade = this.cidadeSelecionada;
    this.cliente.cep = this.formulario.value.cep!;
    this.cliente.fonefixo = this.formulario.value.fonefixo!;
    this.cliente.fone = this.formulario.value.fone!;
    this.cliente.celular2 = this.formulario.value.celular2!;
    this.cliente.email = this.formulario.value.email!;
    this.cliente.segmento = this.segmentoSelecionado;
    this.cliente.inscestadual = this.formulario.value.inscestadual!;

    console.log(this.cliente);

    // Enviar os dados para a API
    this.servico?.cadastrarCliente(this.cliente).subscribe({
      next: (response) => {
        console.log('Cliente cadastrado com sucesso:', response);
        this.exibirAlertClienteSalvo = true;
        console.log('Valor de response.id:', response.id);
        this.desabilitaBtnCadastrarCliente = false
        

        const id = parseInt(response.id, 10); // Use parseInt para converter a string em número
        if (isNaN(id)) {
        } else {
          this.novocliente = id; // Agora pode atribuir
          alert('Erro: o código de cadastro não é um número válido.');
        }
      }
    });
    
  }

  limpar() {
    // Navega para a primeira rota
    this.router.navigate(['/home']).then(() => {
      // Após a navegação para 'home', navega para 'parametros'
      this.router.navigate(['cliente/cadastro']);
    });
  }

  // Função para remover os acentos de uma string
 removerAcentos(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

buscaCep(): void {
  const cep = this.formulario.get('cep')?.value;

  if (!cep) {
    console.error('CEP não informado.');
    return;
  }

  this.servico.buscaCep(cep).subscribe(
    (data) => {
      console.log('Retorno da ViaCEP:', data);

      // Formata a cidade: transforma em maiúsculas e remove os acentos
      const cidadeFormatada = this.removerAcentos(data.localidade.toUpperCase());

      const cidadeExistente = this.cidades.some(city => city.valor.toLowerCase() === cidadeFormatada.toLowerCase());
      
      if (!cidadeExistente) {
        // Se a cidade não for encontrada, exibe um alerta
        alert('A cidade: ' + cidadeFormatada + " ainda não está cadastrada em nosso sistema. Vá em parâmetros e faça o cadastro");
        return
      } 


      // Atualiza os campos do formulário
      this.formulario.patchValue({
        bairro: data.bairro,
        ruanum: data.logradouro,
        cidade: cidadeFormatada, // A cidade agora está em maiúsculas e sem acento
      });

      this.cidadeSelecionada = cidadeFormatada;

      


    },
    (error) => {
      console.error('Erro ao buscar o CEP:', error);
      alert( " o cep informado é inválido")
    }
  );
}


  
}

