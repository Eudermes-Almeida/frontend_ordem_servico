import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Despesa } from '../modelo/Despesa';

@Injectable({
  providedIn: 'root'
})
export class DespesaService {

  constructor(private http: HttpClient) { }

  urlServidor: string = 'http://localhost:8085/';
  //urlServidor: string = 'http://192.168.15.14:8085/'

  ////URL PARA BUSCAR OS PARÂMETROS DO INICIO DO MES
  urlInicioMes: string = this.urlServidor + 'despesa/iniciomes'

  ////URL PARA SALVAR TODOS OS DADOS INCIO MES DE UMA SÓ VEZ:
  urlSalvarTodoInicioMes: string = this.urlServidor + 'despesa/lote'

  ////URL PARA BUSCAR DESPESAS ENTRE UM INTERVALO DE DATAS/////
  urlBuscaDespesasEntreDatas: string = this.urlServidor + 'vencimento-intervalo?inicio=2000-01-01&fim=2026-04-30'


  //////BUSCA OS PARÂMETROS DO INICIO DO MES:
  getInicioMes(): Observable<Despesa[]> {
    return this.http.get<Despesa[]>(this.urlInicioMes);
  }

  ////PERSISTE TODOS OS DADOS INICIO MES, DE UMA SÓ VEZ:
  // Altere a URL para o caminho correto do seu recurso de despesas

  salvarDespesasEmLote(listaDespesas: Despesa[]): Observable<string> {
  return this.http.post(this.urlSalvarTodoInicioMes, listaDespesas, { 
    responseType: 'text' 
  });
}

/////BUSCA DESPESAS EM UM INTERVALO DE DATAS:
buscaDespesasEntreDatas(dataInicio: string, dataFim: string): Observable<any> {
  // CORRETO: Sem aspas internas e usando ${} para a variável do servidor
  const url = `${this.urlServidor}despesa/vencimento-intervalo?inicio=${dataInicio}&fim=${dataFim}`;
  
  console.log("URL Final:", url);
  return this.http.get<any>(url);
}


consultarDespesasFiltro(dataInicio: string, dataFim: string, categoria: string, status: string): Observable<any> {
  const url = `${this.urlServidor}despesa/vencimento-intervalo-categoria-status?inicio=${dataInicio}&fim=${dataFim}&categoria=${categoria}&status=${status}`;
  return this.http.get<any>(url);
}






}
