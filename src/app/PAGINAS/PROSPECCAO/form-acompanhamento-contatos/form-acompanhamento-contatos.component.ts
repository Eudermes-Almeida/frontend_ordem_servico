import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DataBrParserFormatter } from '../../RELATORIOS/form-relatorios/form-relatorios.component';
import { CANAIS_CONTATO, ContatoProspeccao, RESULTADOS_CONTATO } from '../../../modelo/Prospeccao';
import { ProspeccaoService } from '../../../servico/prospeccao.service';
import { ParametrosService } from '../../../servico/parametros.service';

/** totais de um operador no período */
interface ResumoOperador {
  operador: string;
  contatos: number;
  clientes: number;
  equipamentos: number;
  interessados: number;
  andamento: number;
  rejeitados: number;
  retornosAgendados: number;
  telefone: number;
  whatsapp: number;
}

/** resultados que indicam avanço real na venda */
const RESULTADOS_INTERESSE = ['INTERESSADO', 'ORCAMENTO_ENVIADO', 'COLETA_AGENDADA'];

@Component({
  selector: 'app-form-acompanhamento-contatos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgbDatepickerModule],
  providers: [{ provide: NgbDateParserFormatter, useClass: DataBrParserFormatter }],
  templateUrl: './form-acompanhamento-contatos.component.html',
  styleUrls: [
    '../form-prospeccao/form-prospeccao.component.css',   // mesmo visual da tela de prospecção
    './form-acompanhamento-contatos.component.css',
  ]
})
export class FormAcompanhamentoContatosComponent implements OnInit {

  readonly canais = CANAIS_CONTATO;
  readonly resultadosContato = RESULTADOS_CONTATO;

  dataInicio: NgbDateStruct | null = null;
  dataFim: NgbDateStruct | null = null;
  operador = '';
  atendentes: string[] = [];

  contatos: ContatoProspeccao[] = [];
  resumo: ResumoOperador[] = [];
  total: ResumoOperador | null = null;

  pesquisou = false;
  carregando = false;
  mensagemErro = '';

  constructor(
    private prospeccaoService: ProspeccaoService,
    private parametrosService: ParametrosService,
  ) { }

  ngOnInit(): void {
    this.periodoRapido('semana');
    this.buscar(); // já abre mostrando os últimos 7 dias
    this.parametrosService.getAtendentes().subscribe({
      next: (lista) => this.atendentes = (lista ?? [])
        .map(a => (a.valor ?? '').trim())
        .filter(v => v.length > 0),
      error: () => this.atendentes = []
    });
  }

  // ------------------------------------------------------------ período

  /** atalhos de período: hoje, últimos 7 dias, mês atual */
  periodoRapido(tipo: 'hoje' | 'semana' | 'mes'): void {
    const hoje = new Date();
    const inicio = new Date(hoje);
    if (tipo === 'semana') inicio.setDate(hoje.getDate() - 6);
    if (tipo === 'mes') inicio.setDate(1);
    this.dataInicio = this.paraStruct(inicio);
    this.dataFim = this.paraStruct(hoje);
  }

  get periodoInvalido(): boolean {
    const i = this.paraIso(this.dataInicio);
    const f = this.paraIso(this.dataFim);
    return !i || !f || i > f;
  }

  buscar(): void {
    this.mensagemErro = '';
    const inicio = this.paraIso(this.dataInicio);
    const fim = this.paraIso(this.dataFim);
    if (!inicio || !fim) {
      this.mensagemErro = 'Informe a data inicial e a data final (dd/mm/aaaa).';
      return;
    }
    if (inicio > fim) {
      this.mensagemErro = 'A data final não pode ser anterior à data inicial.';
      return;
    }

    this.carregando = true;
    this.prospeccaoService.listarContatosPeriodo(inicio, fim, this.operador || null).subscribe({
      next: (lista) => {
        this.contatos = lista ?? [];
        this.montarResumo();
        this.pesquisou = true;
        this.carregando = false;
      },
      error: (erro) => {
        this.contatos = [];
        this.montarResumo();
        this.pesquisou = true;
        this.carregando = false;
        this.mensagemErro = typeof erro?.error === 'string' && erro.error
          ? erro.error
          : 'Erro ao consultar o servidor. Verifique se o backend está rodando.';
      }
    });
  }

  // ------------------------------------------------------------ resumo por operador

  private montarResumo(): void {
    const porOperador = new Map<string, { r: ResumoOperador; clientes: Set<number> }>();
    const clientesTotal = new Set<number>();

    const novo = (operador: string): ResumoOperador => ({
      operador, contatos: 0, clientes: 0, equipamentos: 0, interessados: 0,
      andamento: 0, rejeitados: 0, retornosAgendados: 0, telefone: 0, whatsapp: 0,
    });
    const total = novo('TOTAL');

    for (const c of this.contatos) {
      const nome = c.operador || '(sem operador)';
      if (!porOperador.has(nome)) porOperador.set(nome, { r: novo(nome), clientes: new Set<number>() });
      const item = porOperador.get(nome)!;

      for (const alvo of [item.r, total]) {
        alvo.contatos++;
        if (c.canal === 'WHATSAPP') alvo.whatsapp++; else alvo.telefone++;
        if (c.dataRetorno) alvo.retornosAgendados++;
        for (const e of c.equipamentos) {
          alvo.equipamentos++;
          if (RESULTADOS_INTERESSE.includes(e.resultado)) alvo.interessados++;
          if (this.grupoResultado(e.resultado) === 'REJEITADO') alvo.rejeitados++;
          else alvo.andamento++;
        }
      }
      item.clientes.add(c.codcli);
      clientesTotal.add(c.codcli);
    }

    this.resumo = [...porOperador.values()]
      .map(v => ({ ...v.r, clientes: v.clientes.size }))
      .sort((a, b) => b.contatos - a.contatos);
    total.clientes = clientesTotal.size;
    this.total = this.contatos.length > 0 ? total : null;
  }

  // ------------------------------------------------------------ formatação

  nomeResultado(codigo: string | null | undefined): string {
    return this.resultadosContato.find(r => r.codigo === codigo)?.nome ?? (codigo ?? '');
  }

  grupoResultado(codigo: string | null | undefined): string {
    return this.resultadosContato.find(r => r.codigo === codigo)?.grupo ?? '';
  }

  nomeCanal(codigo: string | null | undefined): string {
    return this.canais.find(c => c.codigo === codigo)?.nome ?? (codigo ?? '');
  }

  iconeCanal(codigo: string | null | undefined): string {
    return this.canais.find(c => c.codigo === codigo)?.icone ?? 'bi-chat';
  }

  /** 'yyyy-MM-dd' -> 'dd/MM/yyyy' */
  dataBr(iso: string | null | undefined): string {
    if (!iso || iso.length < 10) return '';
    const [ano, mes, dia] = iso.substring(0, 10).split('-');
    return `${dia}/${mes}/${ano}`;
  }

  /** 'yyyy-MM-ddTHH:mm' -> 'dd/MM/yyyy HH:mm' */
  dataHoraBr(iso: string | null | undefined): string {
    if (!iso) return '';
    const hora = iso.length >= 16 ? iso.substring(11, 16) : '';
    return `${this.dataBr(iso)} ${hora}`.trim();
  }

  private paraStruct(d: Date): NgbDateStruct {
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  }

  /** NgbDateStruct -> 'yyyy-MM-dd' (null se a data não estiver completa) */
  private paraIso(d: NgbDateStruct | null | undefined): string | null {
    if (!d || typeof d !== 'object' || !d.year || !d.month || !d.day) return null;
    return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
  }
}
