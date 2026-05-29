import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ParametrosCombobox } from '../../../modelo/ParametrosCombobox';
import { Cliente } from '../../../modelo/Cliente';
import { Os } from '../../../modelo/Os';
import { FormControl, FormGroup } from '@angular/forms';
import { ParametrosService } from '../../../servico/parametros.service';
import { OrdemservicoService } from '../../../servico/ordemservico.service';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import { Route } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-detalhes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-detalhes.component.html',
  styleUrl: './form-detalhes.component.css'
})
export class FORMDETALHESComponent {
  @ViewChild('numOsInput') numOsInput!: ElementRef;
  variavelEnviada: string = "";
  dadosRecebidos: Os[] = [];
  dataInicio: string = "";
  dataFim: string = "";
  currentDateTime: string = '';
  configImp: boolean = true;
  
  // CONFIGURA FORMULÁRIO
  formulario = new FormGroup({
    dataInicial:new FormControl(''), 
    dataFinal:new FormControl(''), 
     });

     constructor(
      private parametrosService: ParametrosService, 
      private servico: OrdemservicoService,
      private cdr: ChangeDetectorRef,
      private route: ActivatedRoute // Injeta a rota ativa

  ) {}

  // CONFIGURA AS FUNÇÕES QUE SERÃO EXECUTADAS NA INICIALIZAÇÃO DA PÁGINA
  ngOnInit(): void {
  this.carregaNumOsdaUrl() // trata dados que vieram na url
  this.dadosRecebidos = this.servico.getData(); // busca dados que estão na memoria (ultimo relatório chamado)
  console.log(" dados recebidos " , this.dadosRecebidos)
  this.updateDateTime(); // chama metodo para capturar hora e data atual
  this.calculaValorTotalFechado();
}



////////CALCULA O VALOR TOTAL FECHADO//////////

valorTotalFechado: number = 0;

calculaValorTotalFechado(){
this.valorTotalFechado = this.dadosRecebidos.reduce((acc, os) => {

  return acc + (+os.totaliq)
},0)

}

//GERA DATA E HORA NO FORMATO DD-MM-AAAA   HH:MM:SS
updateDateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  this.currentDateTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds} hs`;
}


   //////////////////CAPTURA DADOS QUE VIERAM NA URL //////
  carregaNumOsdaUrl(): void {
    this.variavelEnviada = this.route.snapshot.paramMap.get('variavelEnviada');
    console.log(" esta é a variavel enviada: " + this.variavelEnviada)
    this.dataInicio = this.route.snapshot.paramMap.get('dataInicio');
    this.dataFim = this.route.snapshot.paramMap.get('dataFim');

    console.log(" Este é o numero da os capturado via url : " + this.variavelEnviada)}

  

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async gerarPDF(): Promise<void> {
    try {
      await this.delay(100);
      this.configImp = false;
      await this.delay(100);
  
      const element = document.getElementById('pdf-content');
      if (!element) {
        throw new Error('Elemento com ID "pdf-content" não encontrado.');
      }
  
      const options = {
        margin: [2, 2, 2, 2],
        filename: 'documento.pdf',
        html2canvas: {
          scale: 4,
          letterRendering: true,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
        pagebreak: {
          mode: ['css', 'legacy'],
          after: '.quebra-pagina',
        },
      };
  
      const pdfBlob = await html2pdf().set(options).from(element).toPdf().output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
    } catch (error) {
      console.error('Erro ao gerar o PDF:', error);
    } finally {
      this.configImp = true;
    }
  }
  

}
