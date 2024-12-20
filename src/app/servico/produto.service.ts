// Importar o Injectable para prover a injeção de dependência
import { Injectable } from '@angular/core';

// Importar o HttpClient
import { HttpClient } from '@angular/common/http';

// Importar o modelo de produto
import { Produto } from '../modelo/Produto';

// Importar o RxJS
import { Observable } from 'rxjs';
import { ParametrosCombobox } from '../modelo/ParametrosCombobox';

// Configuração do @Injectable
@Injectable({
  providedIn: 'root'
})

// Classe
export class ProdutoService {

  // URL da API
  url:string = 'http://localhost:8080/cliente/ultimocliente';

  // URL BUSCAR CIDADES:

  urlcidade: string = 'http://localhost:8080/parametro/parametro?parametro=CIDADE';

  // Primeiro método a ser executado quando referenciada a classe de serviço
  constructor(private http:HttpClient) { }

 // Método para selecionar o último cliente (número)
 selecionar(): Observable<number> {
  return this.http.get<number>(this.url);
}

getCidades(): Observable<ParametrosCombobox[]> {
  return this.http.get<ParametrosCombobox[]>(this.urlcidade); // Faz a requisição e retorna o array de cidades
}
  
}