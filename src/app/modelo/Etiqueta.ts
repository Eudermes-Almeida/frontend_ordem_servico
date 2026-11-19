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

/** Página pública aberta pelo QR Code da etiqueta. */
export interface EquipamentoPublico {
  cliente: string;
  equipamento: string;
  marca: string;
  modelo: string;
  serial: string;
  patrimonio: string;
  /** false: serial não identifica o equipamento -> histórico só da OS da etiqueta */
  historicoPorSerial: boolean;
  ultimaManutencao: PassagemPublica | null;
  historico: PassagemPublica[];
}
