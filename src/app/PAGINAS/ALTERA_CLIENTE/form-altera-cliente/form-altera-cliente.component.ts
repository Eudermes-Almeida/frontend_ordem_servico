import { Component, OnInit } from '@angular/core';
import { ParametrosCombobox } from '../../../modelo/ParametrosCombobox';
import { ParametrosService } from '../../../servico/parametros.service';
import { OrdemservicoService } from '../../../servico/ordemservico.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from '../../../modelo/Cliente';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-altera-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-altera-cliente.component.html',
  styleUrl: './form-altera-cliente.component.css'
})
export class FORMALTERACLIENTEComponent implements OnInit {
  cidades: ParametrosCombobox[] = [];
  cidadeSelecionada: string = "";
  cidadesPosicaoZero: any = { id: 100, parametro: 'SEGMENTO', valor: 'CIDADES' };

  segmentos: ParametrosCombobox[] = [];
  segmentoSelecionado: string = "";
  segmentosPosicaoZero: any = { id: 100, parametro: 'SEGMENTO', valor: 'SEGMENTOS' };

  constructor(
    private parametrosService: ParametrosService, 
    private servico: OrdemservicoService,
    private route: ActivatedRoute  // para pegar o parâmetro na rota
  ) {}

  ngOnInit(): void {
    if (this.parametrosService) {
      this.buscarCidades();
      this.buscarSegmentos();
      this.ativarFullscreen();
    }
  
    // Captura o ID da URL
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    if (id) {
      // Chama a função getCliente com o ID capturado
      this.getCliente(id);
    } else {
      console.error('ID não encontrado na URL');
    }
  }


  //////////////CONTROLE DE RENDENRIZAÇÃO//////////////

  exibirAlertClienteSalvo: Boolean = false;

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

  buscarCidades(): void {
    this.parametrosService.getCidades().subscribe(
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

  onCityChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.cidadeSelecionada = selectElement.value;
  }

  buscarSegmentos(): void {
    this.parametrosService.getSegmentos().subscribe(
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

  // CONFIGURA O FORMULÁRIO
  formulario = new FormGroup({
    codcli: new FormControl(''),
    nomefantasia: new FormControl('', Validators.required),
    razaosocial: new FormControl(''),
    tipo: new FormControl(''),
    cpfcnpj: new FormControl(''),
    contato: new FormControl(''),
    ruanum: new FormControl(''),
    num: new FormControl(''),
    bairro: new FormControl(''),
    cidade: new FormControl(''),
    cep: new FormControl(''),
    fonefixo: new FormControl(''),
    fone: new FormControl(''),
    celular2: new FormControl(''),
    email: new FormControl(''),
    segmento: new FormControl(''),
    inscestadual: new FormControl(''),
  });

  cliente: Cliente = new Cliente();
  objetocliente: Cliente[] = [];

  // Busca Cliente por id
  getCliente(id: number): void {
    this.servico.getClientePorId(id).subscribe(
      (data: Cliente) => {
        this.objetocliente = [data]; // Coloca o cliente dentro de um array
        console.log('Cliente obtido:', this.objetocliente);

        // Preenche o formulário com os dados do cliente
        this.formulario.patchValue({
          codcli: data.id,
          nomefantasia: data.nomefantasia,
          razaosocial: data.razaosocial,
          tipo: data.tipo,
          cpfcnpj: data.cpfcnpj,
          contato: data.contato,
          ruanum: data.ruanum,
          num: data.num,
          bairro: data.bairro,
          cidade: data.cidade,
          cep: data.cep,
          fonefixo: data.fonefixo,
          fone: data.fone,
          celular2: data.celular2,
          email: data.email,
          segmento: data.segmento,
          inscestadual: data.inscestadual
        });
      },
      (error) => {
        if (error.status === 404) {
          alert(`Você informou o código ${id}, não existe cliente para este código`);
        } else {
          console.error('Erro ao buscar cliente:', error);
          alert(`Erro ao buscar cliente: ${error.message}`);
        }
      }
    );
  }

  // Método para salvar alterações do cliente
salvarAlteracoes(): void {

  // Captura o ID da URL e converte para número
  const id = Number(this.route.snapshot.paramMap.get('id'));

  if (!isNaN(id)) {

    // Coleta os dados do formulário e atribui ao objeto clienteAtualizado
    let clienteAtualizado: Cliente = this.formulario.value as Cliente;

    // Função para transformar valores undefined em strings vazias
    clienteAtualizado = this.transformUndefinedToEmpty(clienteAtualizado);

    // Chama o método de atualização passando o id e o cliente atualizado
    this.servico.atualizarCliente(id, clienteAtualizado).subscribe(
      (response) => {
        console.log("entrou no response");
        console.log('Cliente atualizado com sucesso', response);
        this.exibirAlertClienteSalvo = true;
      },
      (error) => {
        console.log("entrou no erro");
        console.error('Erro ao atualizar cliente:', error);
        alert('Erro ao atualizar cliente.');
      }
    );
  } else {
    console.error('ID inválido');
    alert('ID inválido.');
  }
}

// Função que percorre o objeto cliente e transforma undefined em ""
transformUndefinedToEmpty(cliente: Partial<Cliente>): Cliente {
  const clienteCorrigido: Partial<Cliente> = {};
  for (const key in cliente) {
    if (cliente.hasOwnProperty(key)) {
      // Forçamos a indexação com keyof Cliente para tipar as chaves corretamente
      clienteCorrigido[key as keyof Cliente] = cliente[key as keyof Cliente] === undefined ? '' : cliente[key as keyof Cliente];
    }
  }
  return clienteCorrigido as Cliente;
}

  // Método para enviar os dados do formulário e atualizar o cliente
  atualizarCliente(): void {
    const id = Number(this.formulario.get('codcli')?.value);
    console.log("este é o valor do id " + id);

    if (!isNaN(id)) {
      const clienteAtualizado: Cliente = this.formulario.value as Cliente;
      this.servico.atualizarCliente(id, clienteAtualizado).subscribe(
        (response) => {
          console.log('Cliente atualizado com sucesso:', response);
          alert('Cliente atualizado com sucesso!');
        },
        (error) => {
          console.error('Erro ao atualizar cliente:', error);
          alert('Erro ao atualizar cliente.');
        }
      );
    } else {
      console.error('ID do cliente inválido');
      alert('ID do cliente inválido.');
    }
  }

  // Coleta os dados do formulario e salva no obejto
  escreveconsole() {
    const clienteComValoresLimpos: Cliente = {
      ...this.cliente,
      nomefantasia: this.formulario.value.nomefantasia || "",
      razaosocial: this.formulario.value.razaosocial || "",
      tipo: this.formulario.value.tipo || "",
      cpfcnpj: this.formulario.value.cpfcnpj || "",
      contato: this.formulario.value.contato || "",
      ruanum: this.formulario.value.ruanum || "",
      num: this.formulario.value.num || "",
      bairro: this.formulario.value.bairro || "",
      cidade: this.cidadeSelecionada || "",
      cep: this.formulario.value.cep || "",
      fonefixo: this.formulario.value.fonefixo || "",
      fone: this.formulario.value.fone || "",
      celular2: this.formulario.value.celular2 || "",
      email: this.formulario.value.email || "",
      segmento: this.segmentoSelecionado || "",
      inscestadual: this.formulario.value.inscestadual || ""
    };

    console.log("Cliente com valores limpos a ser cadastrado:", clienteComValoresLimpos);
  }
}
