
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ParametrosCombobox } from '../../../modelo/ParametrosCombobox';
import { Cliente } from '../../../modelo/Cliente';
import { Os } from '../../../modelo/Os';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ParametrosService } from '../../../servico/parametros.service';
import { OrdemservicoService } from '../../../servico/ordemservico.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-login-lista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-login-lista.component.html',
  styleUrl: './form-login-lista.component.css'
})
export class FORMLOGINLISTAComponent {


// CONFIGURA AS FUNÇÕES QUE SERÃO EXECUTADAS NA INICIALIZAÇÃO DA PÁGINA
ngOnInit(): void {

  this.carregaCodcliUrl();
  console.log(" entrou na pag lista")
          
}

carregaCodcliUrl(): void {
  const codcliString = this.route.snapshot.paramMap.get('codcli');
  console.log("Valor bruto capturado da URL:", codcliString);

  const codcli = Number(codcliString);
  console.log("Valor convertido para número:", codcli);

  this.getOsPorCodCli(codcli)
  
}

  @ViewChild('numOsInput') numOsInput!: ElementRef;
    
    cliente: Cliente = new Cliente();
    os: Os = new Os();
    objetocliente: Cliente[] = [];
    objetoOs: Os[] = [];
    
    ///////////CONTROLE DE RENDERIZAÇÃO/////////
   
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
        private router: Router,
        private parametrosService: ParametrosService, 
        private servico: OrdemservicoService,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute // Injeta a rota ativa
    ) {}
    
  
    escreveDadosClienteNosInputs(cliente: Cliente): void {
      console.log('Dados do cliente:', cliente);
          this.formulario.patchValue({
              codcli: cliente.id, 
              fantasia: cliente.nomefantasia,
              rzsocial: cliente.razaosocial,
          });
  
      setTimeout(() => {  // aguarda 1 segundo para fechar a tabela
        this.cdr.detectChanges(); // Força a atualização da visualização imediatamente
      }, 1000);
  
    } 
    // Busca ORDEM SERVIÇO por id
    getOsPorId(id: number): void {
      this.servico.getOsPorId(id).subscribe(
        (data: Os) => {
          this.objetoOs = [data]; // Coloca o cliente dentro de um array
          console.log('O.S. obtida:', this.objetoOs);
        
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
  
  
    // Busca ORDENS DE SERVIÇO PELO CODIGO DO CLIENTE
    getOsPorCodCli(codcli: number): void {
      this.servico.getOsPorCodCli(codcli).subscribe(
        (data: Os[]) => { // Espera um array de os
          this.objetoOs = data; // Armazena todos os clientes retornados
          console.log('Os obtidas:', this.objetoOs);
        },
        (error) => {
          if (error.status === 404) {
            alert(`Não há ordem de serviços cadastrados na cidade ${codcli}.`);
          } else {
            console.error('Erro ao buscar clientes por cidade:', error);
            alert(`Erro ao buscar clientes na cidade ${codcli}.`);
          }
        }
      );
    }
  
}
