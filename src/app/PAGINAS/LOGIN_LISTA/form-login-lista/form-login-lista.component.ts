
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
import { EtiquetaService, lerLoginExterno } from '../../../servico/etiqueta.service';
import { FrotaCliente } from '../../../modelo/Etiqueta';
import { FrotaNobreaksComponent } from '../../FROTA_NOBREAKS/frota-nobreaks/frota-nobreaks.component';

@Component({
  selector: 'app-form-login-lista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FrotaNobreaksComponent],
  templateUrl: './form-login-lista.component.html',
  styleUrl: './form-login-lista.component.css'
})
export class FORMLOGINLISTAComponent {


// CONFIGURA AS FUNÇÕES QUE SERÃO EXECUTADAS NA INICIALIZAÇÃO DA PÁGINA
ngOnInit(): void {

  //document.exitFullscreen();
 
   this.carregaCodcliUrl();
   console.log(" entrou na pag lista")
           
 }
 
 carregaCodcliUrl(): void {
   const codcliString = this.route.snapshot.paramMap.get('codcli');
   console.log("Valor bruto capturado da URL:", codcliString);
 
   const codcli = Number(codcliString);
   console.log("Valor convertido para número:", codcli);
 
   this.getAprovacaoOnline(codcli)
   this.carregarFrota(codcli)
   
 }
 
   @ViewChild('numOsInput') numOsInput!: ElementRef;
     
     cliente: Cliente = new Cliente();
     os: Os = new Os();
     objetocliente: Cliente[] = [];
     objetoOs: any[] = [];
     
     ///////////CONTROLE DE RENDERIZAÇÃO/////////
     exibirMensagemAprovacaoRemota: boolean = false;
     exibirMensagemReprovacaoRemota: boolean = false;
    
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
       
        });
   
        constructor(
         private router: Router,
         private parametrosService: ParametrosService, 
         private servico: OrdemservicoService,
         private cdr: ChangeDetectorRef,
         private route: ActivatedRoute, // Injeta a rota ativa
         private etiquetaService: EtiquetaService
     ) {}

     ///////// NOBREAKS DO CLIENTE (situação dos bancos de baterias + orçamento pelo WhatsApp) /////////
     frota: FrotaCliente | null = null;

     /** só depois do login: usa o código + CPF/CNPJ digitados (o backend confere com o cadastro) */
     carregarFrota(codcli: number): void {
       const login = lerLoginExterno();
       if (!login || Number(login.codcli) !== codcli) return;   // abriu a URL direto, sem login
       this.etiquetaService.consultarFrotaCliente(codcli, login.documento).subscribe({
         next: (f) => this.frota = f,
         error: () => this.frota = null
       });
     }
     
   
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
 
     getAprovacaoOnline(codcli: number): void {
       const status = 'aguardandoAprovacao'; // Status a ser enviado
       //const codcli = 9271; // Código do cliente a ser enviado
   
       // Chama o método getAprovacaoOnline do serviço
       this.servico.getAprovacaoOnline(status, codcli).subscribe(
         (response) => {
           // Armazena os dados recebidos na variável 'dadosAprovacao'
           this.objetoOs = response;
           console.log('Dados de Aprovação:', this.objetoOs);
         },
         (error) => {
           // Trata qualquer erro que ocorra ao fazer a requisição
           console.error('Erro ao obter aprovação online:', error);
         }
       );
     }
 
     modificaStatusOs(osId: string, novoStatus: string) {
       // Convertendo o osId para número antes de passá-lo para o serviço
       const osIdNumerico = Number(osId);  // Ou use +osId
     
       // Chama o serviço para atualizar o status da OS específica
       this.servico.atualizarStatusOrdemServico(osIdNumerico, novoStatus).subscribe({
         next: () => {
           console.log(`Status da OS ${osIdNumerico} atualizado para: ${novoStatus}`);
           
           if (novoStatus === 'APROVADA REMOTA') {
             alert( "Agradecemos a aprovação da ordem de serviço " + osIdNumerico + ". A nossa expectativa é disponibilizar seu equipamento PRONTO em até 48 horas úteis.") 
           }
 
           if (novoStatus === 'REPROVADA REMOTA') {
             alert( "Lamentamos a reprovação da ordem de serviço " + osIdNumerico + ". A nossa expectativa é remontar seu equipamento em até 72 horas úteis.")
             
           }
           
           // Atualize o status localmente (opcional)
           const osAtualizada = this.objetoOs.find(os => os.os === osIdNumerico);
           if (osAtualizada) {
             osAtualizada.status = novoStatus;
           }
         },
         error: (erro) => {
           console.error(`Erro ao atualizar o status da OS ${osIdNumerico}:`, erro);
         }
       });
     }

    }
  

