import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

getRegistrosFiltrados(dataInicio: string, dataFim: string, status: string, tipoData: string): Observable<Financeiro[]> {
  const params = new HttpParams()
    .set('dataInicio', dataInicio)
    .set('dataFim', dataFim)
    .set('status', status)
    .set('tipoData', tipoData); // Adicionado para a API do Quarkus

  const url = `${this.urlServidor}financeiro/filtro-avancado`;
  return this.http.get<Financeiro[]>(url, { params });
}

atualizarFinanceiroEmLote(loteFinanceiro: Financeiro[]): Observable<Financeiro[]> {
  const url = `${this.urlServidor}financeiro/atualizar-lote`;
  
  // Envia a array "loteFinanceiro" diretamente no corpo do PUT
  return this.http.put<Financeiro[]>(url, loteFinanceiro);
}

verificarEAtualizarAtrasos(): Observable<Financeiro[] | string> {
  const url = `${this.urlServidor}financeiro/verificar-atrasos`;
  
  // Como o endpoint não recebe dados no corpo, passamos null
  return this.http.put<Financeiro[] | string>(url, null);
}

getPendentesBordero(): Observable<Financeiro[]> {
  const url = `${this.urlServidor}financeiro/pendentes-bordero`;
  return this.http.get<Financeiro[]>(url);
}

  getBorderoPorData(codbordero: string): Observable<Financeiro[]> {
  const url = `${this.urlServidor}financeiro/bordero?data=${codbordero}`;
  return this.http.get<Financeiro[]>(url);
}

getOsPorRemessa(codremesa: string): Observable<Financeiro[]> {
  const url = `${this.urlServidor}financeiro/remessa?remessa=${codremesa}`;
  return this.http.get<Financeiro[]>(url);
}

buscaTudoMenosPago(): Observable<number> {
  const url = `${this.urlServidor}financeiro/tudomenospago`; 
  return this.http.get<number>(url);
}

}

