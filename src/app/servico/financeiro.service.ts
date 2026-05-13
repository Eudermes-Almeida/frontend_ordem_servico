import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Financeiro } from '../modelo/Financeiro';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {

   constructor(private http:HttpClient) { }

  // quando mudar de servidor, basta alterar este endereço///////////////////
  urlServidor: string = 'http://localhost:8085/'
  //urlServidor: string = 'http://192.168.15.14:8085/'

  // URL CADASTRAR ORDEM SERVICO:
urlFinanceiro: string = this.urlServidor + 'financeiro';

// URL ULTIMA ORDEM SERVIÇO CADASTRADA
urlUltimaOs:string = this.urlServidor+'financeiro/ultima-os';


  ///CRIANDO UM REGISTRO DE UMA OS NO FINANCEIRO:
    CadastrarOsFechadaNoFinanceiro(financeiro: Financeiro): Observable<Financeiro> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<Financeiro>(this.urlFinanceiro, financeiro, { headers });
  }

  getOsPorCodCli(codcli: number): Observable<Financeiro[]> {
    const url = this.urlServidor + `financeiro/codcli?codcli=${codcli}`;
    return this.http.get<Financeiro[]>(url);
  }

  // Método para selecionar a última ordem de serviço (número)
// Garanta que a URL base termine com /financeiro/ultima-os
ultimaOs(): Observable<number> {
  const url = `${this.urlServidor}financeiro/ultima-os`; 
  return this.http.get<number>(url);
}

getOsPorId(id: number): Observable<Financeiro> {  // ELEMENTO ÚNICO
  const url = this.urlServidor+`financeiro/${id}`;
  return this.http.get<Financeiro>(url);
}

getUltimasOrdensServicos(limite: number): Observable<Financeiro[]> {  /// LISTA DE ELEMENTOS
  const url = this.urlServidor + `financeiro/ultimasos?limite=${limite}`;
  return this.http.get<Financeiro[]>(url); // Altere para Observable<Os[]>
}



  
}

