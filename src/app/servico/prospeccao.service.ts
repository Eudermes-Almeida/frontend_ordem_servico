import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ClienteBateriaVencida, ContatoProspeccao, HistoricoEquipamento, LinkCliente, NobreakBateriaVencida
} from '../modelo/Prospeccao';

@Injectable({
  providedIn: 'root'
})
export class ProspeccaoService {

  urlServidor: string = `http://${window.location.hostname}:8085/`;

  constructor(private http: HttpClient) { }

  /**
   * Nobreaks com banco de baterias vencido.
   * codcli, potenciaMinima e potenciaMaxima são opcionais (null = sem filtro).
   */
  buscarNobreaksBateriaVencida(codcli: number | null, meses: number,
                               potenciaMinima: number | null, potenciaMaxima: number | null): Observable<NobreakBateriaVencida[]> {
    let params = new HttpParams().set('meses', meses);
    if (codcli != null) params = params.set('codcli', codcli);
    if (potenciaMinima != null) params = params.set('potenciaMinima', potenciaMinima);
    if (potenciaMaxima != null) params = params.set('potenciaMaxima', potenciaMaxima);
    return this.http.get<NobreakBateriaVencida[]>(this.urlServidor + 'prospeccao/nobreaksBateriaVencida', { params });
  }

  /** Tela "Interação por WhatsApp": mesmos filtros, agrupado por cliente. */
  buscarClientesBateriaVencida(codcli: number | null, meses: number,
                               potenciaMinima: number | null, potenciaMaxima: number | null): Observable<ClienteBateriaVencida[]> {
    let params = new HttpParams().set('meses', meses);
    if (codcli != null) params = params.set('codcli', codcli);
    if (potenciaMinima != null) params = params.set('potenciaMinima', potenciaMinima);
    if (potenciaMaxima != null) params = params.set('potenciaMaxima', potenciaMaxima);
    return this.http.get<ClienteBateriaVencida[]>(this.urlServidor + 'prospeccao/clientesBateriaVencida', { params });
  }

  /** Link público fixo do cliente (criado na primeira vez): <site>/c/CODIGO */
  gerarLinkCliente(codcli: number): Observable<LinkCliente> {
    return this.http.post<LinkCliente>(this.urlServidor + `prospeccao/linkCliente/${codcli}`, null);
  }

  /** Registra um contato do telemarketing (e os equipamentos tratados nele). */
  registrarContato(contato: ContatoProspeccao): Observable<ContatoProspeccao> {
    return this.http.post<ContatoProspeccao>(this.urlServidor + 'prospeccao/contato', contato);
  }

  /** Contatos já feitos com o cliente (mais recentes primeiro). */
  listarContatos(codcli: number): Observable<ContatoProspeccao[]> {
    return this.http.get<ContatoProspeccao[]>(this.urlServidor + `prospeccao/contatos/${codcli}`);
  }

  /** Contatos feitos no período (datas yyyy-MM-dd, inclusivas). operador = null -> todos. */
  listarContatosPeriodo(inicio: string, fim: string, operador: string | null): Observable<ContatoProspeccao[]> {
    let params = new HttpParams().set('inicio', inicio).set('fim', fim);
    if (operador) params = params.set('operador', operador);
    return this.http.get<ContatoProspeccao[]>(this.urlServidor + 'prospeccao/contatosPeriodo', { params });
  }

  /** Todas as passagens do equipamento ao qual a OS pertence. */
  buscarHistoricoEquipamento(os: number): Observable<HistoricoEquipamento[]> {
    return this.http.get<HistoricoEquipamento[]>(this.urlServidor + `prospeccao/historicoEquipamento/${os}`);
  }
}
