import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParametrosCombobox } from '../modelo/ParametrosCombobox'; // Certifique-se de ajustar o caminho
@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

    urlServidor: string = 'http://localhost:8085/';
    //urlServidor: string = 'http://192.168.15.14:8085/'
  
    //URL BUSCAR CIDADES
  urlCidades = this.urlServidor +'parametro/parametro?parametro=CIDADE';

  // URL BUSCAR SEGMENTOS
  urlSegmentos = this.urlServidor +'parametro/parametro?parametro=SEGMENTO';

  // URL BUSCAR EQUIPAMENTOS:
urlEquipamentos: string = this.urlServidor+'parametro/parametro?parametro=EQUIPAMENTO';

// URL BUSCAR MARCAS NOBREAK:
urlMarcaNobreak: string = this.urlServidor+'parametro/parametro?parametro=MARCANOBREAK';

// URL BUSCAR MODELOS NOBREAKS:
urlModeloNobreak: string = this.urlServidor+'parametro/parametro?parametro=MODELONOBREAK';

// URL BUSCAR TOPOLOGIA NOBREAK:
urlTopologiaNobreak: string = this.urlServidor+'parametro/parametro?parametro=TOPOLOGIANOBREAK';

// URL BUSCAR COR:
urlCor: string = this.urlServidor+'parametro/parametro?parametro=COR';

// URL BUSCAR DEFEITOS CLIENTES:
urlDefeitosClientes: string = this.urlServidor+'parametro/parametro?parametro=DEFEITOCLIENTE';

// URL BUSCAR ATENDENTES
urlAtendentes: string = this.urlServidor+'parametro/parametro?parametro=ATENDENTE';

// URL BUSCAR MARCA MONITORES
urlMarcaMonitores: string = this.urlServidor+'parametro/parametro?parametro=MARCAMONITOR';

// URL BUSCAR MODELO MONITORES
urlModeloMonitores: string = this.urlServidor+'parametro/parametro?parametro=MODELOMONITOR';

// URL BUSCAR MARCA MONITORES
urlTopologiaMonitores: string = this.urlServidor+'parametro/parametro?parametro=TOPOLOGIAMONITOR';

// URL BUSCAR MARCA BATERIA
urlMarcaBaterias: string = this.urlServidor+'parametro/parametro?parametro=MARCABATERIA';

// URL BUSCAR MODELO BATERIA
urlModeloBateria: string = this.urlServidor+'parametro/parametro?parametro=MODELOBATERIA';

// URL BUSCAR MARCA BATERIA
urlTopologiaBateria: string = this.urlServidor+'parametro/parametro?parametro=TOPOLOGIABATERIA';

// URL BUSCAR MARCA ESTABILIZADORES
urlMarcaEstabilizador: string = this.urlServidor+'parametro/parametro?parametro=MARCAESTABILIZADOR';

// URL BUSCAR MODELO ESTABILIZADORES
urlModeloEstabilizador: string = this.urlServidor+'parametro/parametro?parametro=MODELOESTABILIZADOR';

// URL BUSCAR MARCA ESTABILIZADORES
urlTopologiaEstabilizador: string = this.urlServidor+'parametro/parametro?parametro=TOPOLOGIAESTABILIZADOR';

urlMarcaAcessorio: string = this.urlServidor+'parametro/parametro?parametro=MARCAACESSORIO';

// URL BUSCAR MODELO ESTABILIZADORES
urlModeloAcessorio: string = this.urlServidor+'parametro/parametro?parametro=MODELOACESSORIO';

// URL BUSCAR MARCA ESTABILIZADORES
urlTopologiaAcessorio: string = this.urlServidor+'parametro/parametro?parametro=TOPOLOGIAACESSORIO';

//URL BUSCA STATUS DE ORDEM SERVIÇO:
urlStatusOs: string = this.urlServidor+'parametro/parametro?parametro=STATUS';

// URL BUSCA TÉCNICOS:
urlTecnicos: string = this.urlServidor+'parametro/parametro?parametro=TECNICO';

// URL BUSCA TAREFA EXECUTADA:
urlTarefaExecutada: string = this.urlServidor+'parametro/parametro?parametro=TAREFAEXECUTADA';

// URL BUSCA MATERIAL ( 2 e 3)
urlMaterial: string = this.urlServidor+'parametro/parametro?parametro=MATERIAL';


// url CRIA NOVO PARAMETRO:
private urlParametro: string = this.urlServidor+'/parametro';

constructor(private http: HttpClient) { }

  getCidades(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlCidades);
  }

  getSegmentos(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlSegmentos);
  }

  getEquipamentos(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlEquipamentos); // Faz a requisição e retorna o array de cidades
  }
  
  getMarcasNobreaks(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlMarcaNobreak); // Faz a requisição e retorna o array de cidades
  }
  
  getModelosNobreaks(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlModeloNobreak); // Faz a requisição e retorna o array de cidades
  }
  
  getTopologiaNobreaks(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlTopologiaNobreak); // Faz a requisição e retorna o array de cidades
  }

  getMarcasMonitores(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlMarcaMonitores); // Faz a requisição e retorna o array de cidades
  }

  getMOdelosMonitores(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlModeloMonitores); // Faz a requisição e retorna o array de cidades
  }

  getTopologiaMonitores(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlTopologiaMonitores); // Faz a requisição e retorna o array de cidades
  }

  getMarcasBaterias(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlMarcaBaterias); // Faz a requisição e retorna o array de cidades
  }

  getMOdelosBaterias(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlModeloBateria); // Faz a requisição e retorna o array de cidades
  }

  getTopologiaBaterias(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlTopologiaBateria); // Faz a requisição e retorna o array de cidades
  }
  
  getMarcasEstabilizadores(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlMarcaEstabilizador); // Faz a requisição e retorna o array de cidades
  }

  getMOdelosEstabizadores(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlModeloEstabilizador); // Faz a requisição e retorna o array de cidades
  }

  getTopologiaEstabilizadores(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlTopologiaEstabilizador); // Faz a requisição e retorna o array de cidades
  }

  getMarcasAcessorios(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlMarcaAcessorio); // Faz a requisição e retorna o array de cidades
  }

  getMOdelosAcessorios(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlModeloAcessorio); // Faz a requisição e retorna o array de cidades
  }

  getTopologiaAcessorios(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlTopologiaAcessorio); // Faz a requisição e retorna o array de cidades
  }

  getCores(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlCor); // Faz a requisição e retorna o array de cidades
  }

  getDefeitos(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlDefeitosClientes); // Faz a requisição e retorna o array de cidades
  }

  getAtendentes(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlAtendentes); // Faz a requisição e retorna o array de cidades
  }

  getStatusOs(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlStatusOs); // Faz a requisição e retorna o array de cidades
  }

  getTecnicos(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlTecnicos); // Faz a requisição e retorna o array de cidades
  }

  getTarefaExecutada(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlTarefaExecutada); // Faz a requisição e retorna o array de cidades
  }

  getMaterial(): Observable<ParametrosCombobox[]> {
    return this.http.get<ParametrosCombobox[]>(this.urlMaterial); // Faz a requisição e retorna o array de cidades
  }

//////CRIA NOVO PARAMETRO/////
createParametro(parametro: { parametro: string; valor: string }): Observable<any> {
  return this.http.post<any>(this.urlParametro, parametro);
}

////////////////APAGA UM PARÂMETRO///////////
deleteParametro(id: number): Observable<any> {
  console.log(" este é o id dentro do delete service " + id)
  const url = `${this.urlParametro}/parametro/${id}`;
  return this.http.delete<any>(url);
}

/////////MODIFICA UM PARAMETRO////////////
updateParametro(id: number, parametro: string, valor: string): Observable<any> {
  const url = `${this.urlParametro}/parametro/${id}`; // URL dinâmica com o ID

  // Monta o objeto esperado pela API
  const parametroAtualizado = {
    id: id,
    parametro: parametro,
    valor: valor
  };

  return this.http.put<any>(url, parametroAtualizado); // Requisição PUT com o body
}



}
