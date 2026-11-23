/** Nobreak com banco de baterias vencido (última manutenção válida do equipamento). */
export interface NobreakBateriaVencida {
  ultimaOs: number;
  codcli: number;
  fantasia: string;
  rzsocial: string;
  marca: string;
  modelo: string;
  potenciaVa: number | null;
  serial: string;
  patrimonio: string;
  /** 'SERIAL' ou 'MARCA+MODELO' */
  identificadoPor: string;
  /** yyyy-MM-dd */
  ultimaManutencao: string;
  valorUltimaOs: string;
  mesesDesdeManutencao: number;
  qtManutencoes: number;
  qtPassagensTotal: number;
  qtPassagensModelo: number;

  // ---------------- telemarketing (só contatos feitos a partir da última manutenção)
  /** identificação do equipamento: 'S|serial' ou 'M|codcli|marca|potencia' */
  chaveEquip: string;
  situacao: SituacaoProspeccao;
  /** yyyy-MM-ddTHH:mm */
  clienteUltimoContato: string | null;
  clienteUltimoOperador: string | null;
  equipResultado: string | null;
  /** yyyy-MM-ddTHH:mm */
  equipUltimoContato: string | null;
  equipOperador: string | null;
  /** yyyy-MM-dd */
  equipDataRetorno: string | null;
}

export type SituacaoProspeccao = 'SEM_CONTATO' | 'CLIENTE_CONTATADO' | 'ANDAMENTO' | 'REJEITADO';

/** Um contato do telemarketing com o cliente. */
export interface ContatoProspeccao {
  id?: number;
  codcli: number;
  /** nome fantasia do cliente (preenchido pelo servidor nas consultas) */
  fantasia?: string;
  /** yyyy-MM-ddTHH:mm (preenchido pelo servidor) */
  dataHora?: string;
  operador: string;
  canal: 'TELEFONE' | 'WHATSAPP';
  pessoaContatada: string;
  observacao: string;
  /** yyyy-MM-dd */
  dataRetorno: string | null;
  equipamentos: ContatoEquip[];
}

/** Equipamento tratado em um contato, com o resultado para ele. */
export interface ContatoEquip {
  chaveEquip: string;
  osReferencia: number | null;
  marca: string;
  modelo: string;
  serial: string;
  resultado: string;
}

export const CANAIS_CONTATO: { codigo: 'TELEFONE' | 'WHATSAPP'; nome: string; icone: string }[] = [
  { codigo: 'TELEFONE', nome: 'Telefone', icone: 'bi-telephone' },
  { codigo: 'WHATSAPP', nome: 'WhatsApp', icone: 'bi-whatsapp' },
];

/** Resultados possíveis de um contato, por equipamento. */
export const RESULTADOS_CONTATO: { codigo: string; nome: string; grupo: 'ANDAMENTO' | 'REJEITADO' }[] = [
  { codigo: 'NAO_ATENDEU', nome: 'Não atendeu / ocupado', grupo: 'ANDAMENTO' },
  { codigo: 'PEDIU_RETORNO', nome: 'Pediu retorno', grupo: 'ANDAMENTO' },
  { codigo: 'INTERESSADO', nome: 'Interessado – enviar orçamento', grupo: 'ANDAMENTO' },
  { codigo: 'ORCAMENTO_ENVIADO', nome: 'Orçamento enviado', grupo: 'ANDAMENTO' },
  { codigo: 'COLETA_AGENDADA', nome: 'Coleta agendada', grupo: 'ANDAMENTO' },
  { codigo: 'SEM_INTERESSE', nome: 'Sem interesse', grupo: 'REJEITADO' },
  { codigo: 'TROCOU_FORA', nome: 'Já trocou em outro lugar', grupo: 'REJEITADO' },
  { codigo: 'DESATIVADO', nome: 'Equipamento desativado / vendido', grupo: 'REJEITADO' },
  { codigo: 'TELEFONE_ERRADO', nome: 'Telefone errado', grupo: 'REJEITADO' },
];

/** Dias em que um novo contato com o mesmo cliente gera aviso de "contatado recentemente". */
export const DIAS_AVISO_CONTATO_RECENTE = 7;

/** Uma passagem (OS) do equipamento pelo laboratório. */
export interface HistoricoEquipamento {
  os: number;
  codcli: number;
  fantasia: string;
  /** yyyy-MM-dd */
  data: string;
  /** yyyy-MM-dd */
  fechamento: string | null;
  status: string;
  totaliq: string;
  marca: string;
  modelo: string;
  serial: string;
  tarefa1: string;
  baterias: string;
  qt1: string;
  tecnico: string;
  /** true = OS fechada com valor > 0 */
  valida: boolean;
}

/** Lista oficial de modelos (em ordem de tamanho) com a potência equivalente em VA. */
export const MODELOS_NOBREAK: { nome: string; va: number }[] = [
  { nome: '500 VA', va: 500 },
  { nome: '600 VA', va: 600 },
  { nome: '700 VA', va: 700 },
  { nome: '800 VA', va: 800 },
  { nome: '1 KVA', va: 1000 },
  { nome: '1,2 KVA', va: 1200 },
  { nome: '1,3 KVA', va: 1300 },
  { nome: '1,4 KVA', va: 1400 },
  { nome: '1,5 KVA', va: 1500 },
  { nome: '1,8 KVA', va: 1800 },
  { nome: '2 KVA', va: 2000 },
  { nome: '2,2 KVA', va: 2200 },
  { nome: '2,4 KVA', va: 2400 },
  { nome: '3 KVA', va: 3000 },
  { nome: '3,2 KVA', va: 3200 },
  { nome: '3,5 KVA', va: 3500 },
  { nome: '3/4 HP', va: 3750 },
  { nome: '4 KVA', va: 4000 },
  { nome: '5 KVA', va: 5000 },
  { nome: '6 KVA', va: 6000 },
  { nome: '8 KVA', va: 8000 },
  { nome: '10 KVA', va: 10000 },
  { nome: '12 KVA', va: 12000 },
  { nome: '15 KVA', va: 15000 },
  { nome: '20 KVA', va: 20000 },
  { nome: '30 KVA', va: 30000 },
];

/** Prazos desde a última troca de baterias. */
export const PRAZOS_BATERIA: { nome: string; meses: number }[] = [
  { nome: '6 meses', meses: 6 },
  { nome: '1 ano', meses: 12 },
  { nome: '18 meses', meses: 18 },
  { nome: '2 anos', meses: 24 },
  { nome: '30 meses', meses: 30 },
  { nome: '36 meses', meses: 36 },
  { nome: '48 meses', meses: 48 },
];

/** Cliente com nobreaks de baterias vencidas (tela "Interação por WhatsApp"). */
export interface ClienteBateriaVencida {
  codcli: number;
  fantasia: string;
  rzsocial: string;
  /** campo CONTATO do cadastro */
  contato: string | null;
  /** campo FONE do cadastro (rótulo "Whatsapp"), como foi digitado */
  whatsapp: string | null;
  /** nobreaks do cliente que atendem aos filtros */
  qtNobreaks: number;
  mesesMaisAntigo: number;
  /** último WhatsApp registrado na prospecção (yyyy-MM-ddTHH:mm) */
  ultimoWhatsapp: string | null;
  ultimoWhatsappOperador: string | null;
}

/** Link público fixo do cliente: <site>/c/CODIGO */
export interface LinkCliente {
  codcli: number;
  codigo: string;
  url: string;
}
