// Importar o Injectable para prover a injeção de dependência
import { Injectable } from '@angular/core';

// Importar o HttpClient
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Importar o RxJS
import { Observable } from 'rxjs';
import { ParametrosCombobox } from '../modelo/ParametrosCombobox';
import { Cliente } from '../modelo/Cliente';
import { Os } from '../modelo/Os';
import { BehaviorSubject } from 'rxjs';

// Configuração do @Injectable
@Injectable({
  providedIn: 'root'
})

// Classe
export class OrdemservicoService {

  // quando mudar de servidor, basta alterar este endereço///////////////////
  urlServidor: string = 'http://localhost:8080/'

  // URL ULTIMO CLIENTE CADASTRADO
  url:string = this.urlServidor+'cliente/ultimocliente';

  // URL BUSCAR CIDADES:
  urlcidade: string = this.urlServidor+'parametro/parametro?parametro=CIDADE';

  // URL CADASTRAR CLIENTE:
  urlcadastrarcliente = this.urlServidor+'cliente'; 

  // URL BUSCA CLIENTE POR ID:
  urlBuscaClientePorId: string = this.urlServidor;

  
  
  // Primeiro método a ser executado quando referenciada a classe de serviço
  constructor(private http:HttpClient) { }

 // Método para selecionar o último cliente (número)
ultimocliente(): Observable<number> {
  return this.http.get<number>(this.url);
}

cadastrarCliente(cliente: Cliente): Observable<Cliente> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<Cliente>(this.urlcadastrarcliente, cliente, { headers });
  }

getCidades(): Observable<ParametrosCombobox[]> {
  console.log(" dentro de get cidades")
  console.log(" segue url servidor " + this.urlServidor)
  return this.http.get<ParametrosCombobox[]>(this.urlcidade); // Faz a requisição e retorna o array de cidades
}

getClientePorId(id: number): Observable<Cliente> {
  const url = this.urlServidor+`cliente/${id}`;
  return this.http.get<Cliente>(url);
}

// Método para buscar clientes por fragmento de nome fantasia
getClientesPorNomeFantasia(nomefantasia: string): Observable<Cliente[]> {
  const url = this.urlServidor+`cliente/fantasia?nomefantasia=${nomefantasia}`;
  return this.http.get<Cliente[]>(url);
}

// Método para buscar clientes por fragmento de razao Social
getClientesPorRazaoSoocial(razaosocial: string): Observable<Cliente[]> {
  const url = this.urlServidor+`cliente/razaosocial?razaosocial=${razaosocial}`;
  return this.http.get<Cliente[]>(url);
}

// Método para buscar clientes por Cidade
getClientesPorCidade(cidade: string): Observable<Cliente[]> {
  const url = this.urlServidor+`cliente/cidade?cidade=${cidade}`;
  return this.http.get<Cliente[]>(url);
}

// Método service para atualizar um cliente
atualizarCliente(id: number, cliente: Cliente): Observable<Cliente> {
  const url = this.urlServidor+`cliente/clientes/${id}`;
  return this.http.put<Cliente>(url, cliente);
}

/////////////////////METODOS ORDEM DE SERVIÇO/////////////////////////

// URL ULTIMA ORDEM SERVIÇO CADASTRADA
urlUltimaOs:string = this.urlServidor+'os/ultimaos';

// URL CADASTRAR ORDEM SERVICO:
urlCadastrarOs: string = this.urlServidor + 'os';

// URL PARA BUSCAR OS POR CÓDIGO DO CLIENTE:
urlBuscarOsPorCodCli: string = this.urlServidor + 'os/codcli?codcli';

//// URL PARA APAGAR ORDEM DE SERVIÇO:

urlApagarOs: string = this.urlServidor + 'os/os';


// Método para selecionar a última ordem de serviço (número)
ultimaOs(): Observable<number> {
  return this.http.get<number>(this.urlUltimaOs);
}

cadastrarOs(os: Os): Observable<Os> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  
  return this.http.post<Os>(this.urlCadastrarOs, os, { headers });
}

getOsPorId(id: number): Observable<Os> {  // ELEMENTO ÚNICO
  const url = this.urlServidor+`os/${id}`;
  return this.http.get<Os>(url);
}

getOsPorCodCli(codcli: number): Observable<Os[]> {
  const url = this.urlServidor + `os/codcli?codcli=${codcli}`;
  return this.http.get<Os[]>(url); // Altere para Observable<Os[]>
}

getOsPorDadaEntrada(dataEntrada: string): Observable<Os[]> {  /// LISTA DE ELEMENTOS
  const url = this.urlServidor + `os/buscarPorDataEntrada/${dataEntrada}`;
  return this.http.get<Os[]>(url); // Altere para Observable<Os[]>
}

getUltimasOrdensServicos(limite: number): Observable<Os[]> {  /// LISTA DE ELEMENTOS
  const url = this.urlServidor + `os/ultimasos?limite=${limite}`;
  return this.http.get<Os[]>(url); // Altere para Observable<Os[]>
}

getOsPeloSerial(serial: string): Observable<Os[]> {  /// LISTA DE ELEMENTOS
  const url = this.urlServidor + `os/serial?serial=${serial}`;
  return this.http.get<Os[]>(url); // Altere para Observable<Os[]>
}

// Método service para atualizar uma OS:
atualizarOrdemServico(id: number, os: Os): Observable<Os> {
  const url = this.urlServidor+`os/os/${id}`;
  return this.http.put<Os>(url, os);
}

/////METODO PARA APAGAR ORDEM DE SERVIÇO/////
deleteOs(id: number): Observable<void> {
  const url = `${this.urlApagarOs}/${id}`;
  return this.http.delete<void>(url);
}


//////////////////////////METODOS PARA RELATÓRIOS///////////////////////////////////////////

buscaRelatoriosEntreDatas(dataInicio: string, dataFim: string, busca: string): Observable<any> {
  const url = `${this.urlServidor}relatorio/osFechadasEntreDatas?dataInicio=${dataInicio}&dataFim=${dataFim}&busca=${busca}`;
  return this.http.get<any>(url);
}

buscaRelatoriosStatus(status: string): Observable<any> {
  const url = `${this.urlServidor}relatorio/osPorStatus?status=${status}`;
  return this.http.get<any>(url);
}

buscaCalculoComissaoTecnicos(dataInicio: string, dataFim: string, busca: string): Observable<any> {
  const urlComissao = `${this.urlServidor}relatorio/calculoComissaoTecnicos?dataInicio=${dataInicio}&dataFim=${dataFim}&busca=${busca}`;
  console.log(" esta é a url para buscar comissão tecnicos: " + urlComissao)
  return this.http.get<any>(urlComissao);
}


/////Retorna a relação que será passada para a consulta de orçamento on line:
getAprovacaoOnline(status: string, codcli: number): Observable<any> {
  // Monta a URL com os parâmetros passados
  const url = `${this.urlServidor}relatorio/aprovacaoOnline?status=${status}&codcli=${codcli}`;
  
  // Faz a requisição GET para a API e retorna a resposta como Observable
  return this.http.get<any>(url);
}

/////////////////////////SERVIÇO DE MEMORIZAÇÃO DE DADOS ENTRE PAGINAS//////////////////

@Injectable({
  providedIn: 'root',
})

private data: any;
private dataInicio: any;
private dataFim: any;
private os: any;

  setData(data: any): void {
    this.data = data;
  }

  getData(): any {
    return this.data;
  }

  clearData(): void {
    this.data = null;
  }

  /////MEMORIZA DATA INCIAL DO RELATÓRIO
  setDataInicio(dataInicio: any): void {
    this.dataInicio = dataInicio;
  }

  getDataInicio(): any {
    return this.dataInicio;
  }

  clearDataInicio(): void {
    this.dataInicio = null;
  }

  /////MEMORIZA DATA FIM DO RELATÓRIO
  setDataFim(dataFim: any): void {
    this.dataFim = dataFim;
  }

  getDataFim(): any {
    return this.dataFim;
  }

  clearDatafim(): void {
    this.dataFim = null;
  }

  //////////MEMORIZA ORDEM DE SERVICO PARA SER EXIBIDA NO TIME LNNE////////

/////MEMORIZA E RESGATA ORDEM DE SERVIÇO:
private osSubject = new BehaviorSubject<any>(null); // Inicializa com null
  os$ = this.osSubject.asObservable(); // Expondo como Observable

  setOs(os: any): void {
    this.osSubject.next(os); // Atualiza o valor
  }

  getOs(): any {
    return this.osSubject.getValue(); // Obtém o valor atual
  }


  /////BUSCA ENDEREÇO POR CEP///////////////

  private readonly baseUrl = 'https://viacep.com.br/ws/';

  buscaCep(cep: string): Observable<any> {
    const url = `${this.baseUrl}${cep}/json/`;
    return this.http.get(url);
  }


}