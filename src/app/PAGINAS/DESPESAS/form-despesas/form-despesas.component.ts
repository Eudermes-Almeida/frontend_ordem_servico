
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-form-despesas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgbDatepickerModule, FormsModule],
  templateUrl: './form-despesas.component.html',
  styleUrl: './form-despesas.component.css'
})
export class FormDespesasComponent {

  // ADICIONE ESTA LINHA AQUI:
  model: NgbDateStruct | undefined; 

  
 
iniciarMes(){
  console.log(" Inicia Mes")
}

cadastrarDespesasAvulsas(){
  console.log("cadastrar despesas avulsas")
}

}
