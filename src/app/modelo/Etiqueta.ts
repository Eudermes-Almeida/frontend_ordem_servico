/** Dados para imprimir a etiqueta 50 x 30 mm de uma OS fechada (uso interno). */
export interface EtiquetaOs {
  os: number;
  /** código aleatório que vai no QR Code */
  codigo: string;
  /** link completo gravado no QR Code */
  url: string;
  /** datas yyyy-MM-dd */
  fechamento: string;
  garantiaServicoAte: string;
  /** null quando a OS não trocou baterias */
  garantiaBateriaAte: string | null;
  equipamento: string;
  marca: string;
  modelo: string;
  serial: string;
  fantasia: string;
}

/** Uma OS do equipamento, como aparece na página pública do QR (sem valores). */
export interface PassagemPublica {
  os: number;
  entrada: string | null;
  fechamento: string | null;
  status: string;
  defeitos: string[];
  servicos: string[];
  itens: string[];
  tecnico: string;
  trocouBateria: boolean;
  garantiaServicoAte: string | null;
  garantiaBateriaAte: string | null;
  osDaEtiqueta: boolean;
}

/** ATIVO (< 18 meses), ATENCAO (18 a < 24) ou VENCIDO (>= 24) */
export type SituacaoBanco = 'ATIVO' | 'ATENCAO' | 'VENCIDO';

/** Um nobreak do cliente, com a situação do banco de baterias (sem valores). */
export interface FrotaNobreak {
  marca: string;
  modelo: string;
  /** só a parte do serial que identifica o aparelho; null se não houver */
  serial: string | null;
  patrimonio: string | null;
  ultimaOs: number;
  /** yyyy-MM-dd */
  ultimaManutencao: string;
  meses: number;
  situacao: SituacaoBanco;
}

/** Nobreaks do cliente da etiqueta (botão "Nobreaks deste cliente"). */
export interface FrotaCliente {
  cliente: string;
  codcli: number | null;
  ativos: number;
  atencao: number;
  vencidos: number;
  /** vencidos, atenção e ativos, nessa ordem */
  nobreaks: FrotaNobreak[];
}

/** Página pública aberta pelo QR Code da etiqueta. */
export interface EquipamentoPublico {
  cliente: string;
  codcli: number | null;
  equipamento: string;
  marca: string;
  modelo: string;
  serial: string;
  patrimonio: string;
  /** false: serial não identifica o equipamento -> histórico só da OS da etiqueta */
  historicoPorSerial: boolean;
  /** estado do banco de baterias deste aparelho (null = sem manutenção válida) */
  bateriaSituacao: SituacaoBanco | null;
  bateriaUltimaManutencao: string | null;
  bateriaMeses: number | null;
  bateriaOs: number | null;
  ultimaManutencao: PassagemPublica | null;
  historico: PassagemPublica[];
}
