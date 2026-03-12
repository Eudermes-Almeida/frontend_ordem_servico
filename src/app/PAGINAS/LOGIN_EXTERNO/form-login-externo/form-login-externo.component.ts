import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ParametrosCombobox } from '../../../modelo/ParametrosCombobox';
import { Cliente } from '../../../modelo/Cliente';
import { Os } from '../../../modelo/Os';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParametrosService } from '../../../servico/parametros.service';
import { OrdemservicoService } from '../../../servico/ordemservico.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-form-login-externo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './form-login-externo.component.html',
  styleUrl: './form-login-externo.component.css'
})
export class FORMLOGINEXTERNOComponent {
  @ViewChild('numOsInput') numOsInput!: ElementRef;

  // CONFIGURA AS FUNÇÕES QUE SERÃO EXECUTADAS NA INICIALIZAÇÃO DA PÁGINA
  ngOnInit(): void {
    document.exitFullscreen();
  }
    
    cliente: Cliente = new Cliente();
    os: Os = new Os();
    objetocliente: Cliente[] = [];
    objetoOs: Os[] = [];
    codcli: string = '';
    cpfCnpj: string = '';
    id: number = 0;
    cpfCnpjBuscadoAPI: string = "";


    onSubmit(): void {
      console.log('Código do Cliente:', this.codcli);
      console.log('CPF ou CNPJ:', this.cpfCnpj);

      this.id = Number(this.codcli);
      this.getCliente(this.id);
  
    }

  
    ///////////CONTROLE DE RENDERIZAÇÃO/////////
    exibirMensagemErro: boolean = false;
  
       constructor(
        private router: Router,
        private parametrosService: ParametrosService, 
        private servico: OrdemservicoService,
        private cdr: ChangeDetectorRef
    ) {}
  

    
      
    // Busca Clientes por id
    getCliente(id: number): void {
      this.servico.getClientePorId(id).subscribe(
        (data: Cliente) => {
          this.objetocliente = [data]; // Coloca o cliente dentro de um array
          console.log('Cliente obtido:', this.objetocliente);
          this.cpfCnpjBuscadoAPI = this.objetocliente[0].cpfcnpj.replace(/[.\-/\s]/g, '');
          console.log( "este é o cnpj do cliente: " + this.cpfCnpjBuscadoAPI)

          if(this.cpfCnpjBuscadoAPI == this.cpfCnpj){
            console.log(" ok os cnpj estão iguais")
            //this.router.navigate([`/login/lista/${this.codcli}`]); // aqui chama a página login lista e passa o codcli
              this.router.navigate([`/login/lista/${this.codcli}`]); // Verifique se this.codcli é um número

          }else {console.log(" xiii os cnpjs estão diferentes")
                  this.exibirMensagemErro = true;
          }

          

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
  
  
    // Busca ORDENS DE SERVIÇO PELO CODIGO DO CLIENTE
    getOsPorCodCli(codcli: number): void {
      this.servico.getOsPorCodCli(codcli).subscribe(
        (data: Os[]) => { // Espera um array de os
          this.objetoOs = data; // Armazena todos os clientes retornados
          console.log('Os obtidas:', this.objetoOs);
        
        },
        (error) => {
          if (error.status === 404) {
            alert(`Não há ordem de serviços cadastrados neste código: ${codcli}.`);
          } else {
            console.error('Erro ao buscar clientes', error);
            alert(`Erro ao buscar cliente com este código ${codcli}.`);
          }
        }
      );
    }

    ////RECARREGA A PÁGINA////
    reloadPage(): void {
      window.location.reload();
  }
  
  
    
    

}
