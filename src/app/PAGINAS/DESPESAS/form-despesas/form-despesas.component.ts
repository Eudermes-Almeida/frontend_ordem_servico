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
  // Usamos o .map para criar uma nova lista baseada na original
  const listaParaSalvar = this.dadosInicioMes.map(item => {
    return {
      ...item,           // Copia todas as propriedades originais
      id: undefined,     // Remove o ID (ou define como undefined para o banco ignorar)
      iniciomes: "NAO"   // Altera o parâmetro para "NAO"
    };
  });

  // 4. Chamada ao service enviando a lista tratada
  this.despesaService.salvarDespesasEmLote(listaParaSalvar).subscribe({
    next: (response) => {
      console.log('Lote salvo com sucesso:', response);
      alert("Todas as despesas foram registradas com sucesso!");
      
      // Opcional: Limpar a variável após o sucesso
      this.dadosInicioMes = []; 
    },
    error: (error) => {
      console.error('Erro ao salvar lote:', error);
      alert("Erro ao salvar despesas: " + (error.error || "Erro desconhecido"));
    }
  });
}


}



