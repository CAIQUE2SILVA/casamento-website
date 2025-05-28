export interface Acompanhante {
  id?: string;
  nome: string;
  confirmado: boolean;
  convidado_id?: string;
}

export interface Convidado {
  id?: string;
  nome: string;
  email: string;
  telefone?: string;
  confirmado: boolean;
  convite_enviado: boolean;
  data_envio_convite?: Date | string | null;
  data_confirmacao?: Date | string | null;
  observacoes?: string | null;
  acompanhantes?: Acompanhante[];
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface EstatisticasConvidados {
  total: number;
  confirmados: number;
  pendentes: number;
  convitesEnviados: number;
  totalPessoas: number; // convidados + acompanhantes
  totalConfirmados: number; // convidados confirmados + acompanhantes confirmados
}
