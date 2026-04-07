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


    //////BUSCA OS PARÂMETROS DO INICIO DO MES:

    getInicioMes(): Observable<Despesa[]> {
        return this.http.get<Despesa[]>(this.urlInicioMes);
      }
}
