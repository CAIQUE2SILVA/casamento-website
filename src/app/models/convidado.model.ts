export interface Acompanhante {
  id?: string;
  nome: string;
  confirmado: boolean;
}

export interface Convidado {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  confirmado: boolean;
  conviteEnviado: boolean;
  dataEnvio?: Date;
  dataConfirmacao?: Date;
  observacoes?: string;
  acompanhantes: Acompanhante[];
}

export interface EstatisticasConvidados {
  total: number;
  confirmados: number;
  pendentes: number;
  convitesEnviados: number;
  totalPessoas: number; // convidados + acompanhantes
  totalConfirmados: number; // convidados confirmados + acompanhantes confirmados
}