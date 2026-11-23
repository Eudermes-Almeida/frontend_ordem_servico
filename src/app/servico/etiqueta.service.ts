import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EquipamentoPublico, EtiquetaOs, FrotaCliente } from '../modelo/Etiqueta';

/**
 * Endereço do backend.
 *  - Site externo (app.somonitores.tec.br, aberto pelo QR no celular do cliente): https://api.somonitores.tec.br/
 *  - Rede da loja (IP do servidor, localhost):                                    http://<mesmo endereço>:8085/
 */
export function urlBackend(): string {
  const host = window.location.hostname;
  if (host.endsWith('somonitores.tec.br')) {
    return 'https://api.somonitores.tec.br/';
  }
  return `http://${host}:8085/`;
}

@Injectable({
  providedIn: 'root'
})
export class EtiquetaService {

  urlServidor: string = urlBackend();

  constructor(private http: HttpClient) { }

  /** Cria (ou reaproveita) o código do QR e devolve os dados da etiqueta. Só para OS FECHADA. */
  gerarEtiqueta(os: number): Observable<EtiquetaOs> {
    return this.http.post<EtiquetaOs>(this.urlServidor + `etiqueta/os/${os}`, null);
  }

  /** Página pública do QR: última manutenção e histórico do equipamento (sem valores). */
  consultarEquipamento(codigo: string): Observable<EquipamentoPublico> {
    return this.http.get<EquipamentoPublico>(this.urlServidor + `publico/equipamento/${encodeURIComponent(codigo)}`);
  }

  /** Nobreaks do cliente da etiqueta com a situação do banco de baterias (ativo / atenção / vencido). */
  consultarFrota(codigo: string): Observable<FrotaCliente> {
    return this.http.get<FrotaCliente>(this.urlServidor + `publico/equipamento/${encodeURIComponent(codigo)}/frota`);
  }

  /**
   * Nobreaks do cliente para a lista do login externo. O backend confere o CPF/CNPJ com o cadastro
   * (vai no corpo do POST, não na URL). 403 quando não confere.
   */
  consultarFrotaCliente(codcli: number, documento: string): Observable<FrotaCliente> {
    return this.http.post<FrotaCliente>(this.urlServidor + 'publico/cliente/frota', { codcli, documento });
  }
}

/** login externo: guarda codcli + CPF/CNPJ só nesta aba (sessionStorage) para a lista pedir a frota */
const CHAVE_LOGIN_EXTERNO = 'loginExterno';

export function guardarLoginExterno(codcli: number, documento: string): void {
  try { sessionStorage.setItem(CHAVE_LOGIN_EXTERNO, JSON.stringify({ codcli, documento })); } catch { }
}

export function lerLoginExterno(): { codcli: number; documento: string } | null {
  try {
    const v = sessionStorage.getItem(CHAVE_LOGIN_EXTERNO);
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}
