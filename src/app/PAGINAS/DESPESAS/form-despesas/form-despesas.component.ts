import { DespesaService } from './../../../servico/despesa.service';

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Despesa } from '../../../modelo/Despesa';



@Component({
  selector: 'app-form-despesas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgbDatepickerModule, FormsModule],
  templateUrl: './form-despesas.component.html',
  styleUrl: './form-despesas.component.css'
})
export class FormDespesasComponent {

  constructor(private despesaService: DespesaService){}

  // ADICIONE ESTA LINHA AQUI:
  model: NgbDateStruct | undefined; 
  model2: NgbDateStruct | undefined; 

  dataInicial: string = "";
  dataFinal: string = "";
  dadosInicioMes: any[] = [];
 
iniciarMes(){
  console.log(" Inicia Mes")
}

cadastrarDespesasAvulsas(){
  console.log("cadastrar despesas avulsas")
}


  // Função para converter o objeto em string
  onDateInicial(date: NgbDateStruct) {
    // Formato Brasileiro: DD/MM/AAAA
    const dia = date.day.toString().padStart(2, '0');
    const mes = date.month.toString().padStart(2, '0');
    const ano = date.year;
    
    this.dataInicial = `${dia}/${mes}/${ano}`;
    console.log('Data salva como string:', this.dataInicial);
  }

   onDateFinal(date: NgbDateStruct) {
    // Formato Brasileiro: DD/MM/AAAA
    const dia = date.day.toString().padStart(2, '0');
    const mes = date.month.toString().padStart(2, '0');
    const ano = date.year;
    
    this.dataFinal = `${dia}/${mes}/${ano}`;
    console.log('Data salva como string:', this.dataFinal);
  }

  buscarInicioMes(): void {
      this.despesaService?.getInicioMes().subscribe(
        (dados: Despesa[]) => {
          this.dadosInicioMes = dados;
          console.log(" Estes são os dados do inicio mês ", this.dadosInicioMes)
  },   
      );
    }
}



