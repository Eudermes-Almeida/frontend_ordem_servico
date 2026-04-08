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


  //////BUSCA OS PARÂMETROS DO INICIO DO MES:
  getInicioMes(): Observable<Despesa[]> {
    return this.http.get<Despesa[]>(this.urlInicioMes);
  }

  ////PERSISTE TODOS OS DADOS INICIO MES, DE UMA SÓ VEZ:
  // Altere a URL para o caminho correto do seu recurso de despesas

  salvarDespesasEmLote(listaDespesas: Despesa[]): Observable<any> {
    return this.http.post<any>(this.urlSalvarTodoInicioMes, listaDespesas);
  }




}
