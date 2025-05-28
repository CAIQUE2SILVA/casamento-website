import { Injectable } from '@angular/core';
import { EmailService } from './email.service';
import { Convidado } from '../models/convidado.model';

export interface EstatisticasConvidados {
  total: number;
  confirmados: number;
  pendentes: number;
  convitesEnviados: number;
  totalPessoas: number;
  totalConfirmados: number;
}

@Injectable({
  providedIn: 'root',
})
export class ConvidadosService {
  // Dados mockados para desenvolvimento
  private convidados: any[] = [
    { id: 1, nome: 'João Silva', email: 'joao@exemplo.com', confirmado: false },
    {
      id: 2,
      nome: 'Maria Oliveira',
      email: 'maria@exemplo.com',
      confirmado: true,
    },
  ];

  constructor(private emailService: EmailService) {}

  // Método para obter todos os convidados
  getConvidados() {
    return Promise.resolve(this.convidados);
  }

  // Método para adicionar um novo convidado
  async addConvidado(convidado: any) {
    const novoId =
      this.convidados.length > 0
        ? Math.max(...this.convidados.map((c) => c.id)) + 1
        : 1;

    const novoConvidado = {
      ...convidado,
      id: novoId,
      confirmado: false,
    };

    this.convidados.push(novoConvidado);
    return Promise.resolve(novoConvidado);
  }

  // Método para atualizar um convidado
  async updateConvidado(id: number, dados: any) {
    const index = this.convidados.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.convidados[index] = { ...this.convidados[index], ...dados };
      return Promise.resolve(this.convidados[index]);
    }
    return Promise.reject('Convidado não encontrado');
  }

  // Método para excluir um convidado
  async deleteConvidado(id: number) {
    const index = this.convidados.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.convidados.splice(index, 1);
      return Promise.resolve(true);
    }
    return Promise.reject('Convidado não encontrado');
  }

  async confirmarPresencaPublica(
    nome: string,
    email: string,
    telefone: string,
    acompanhantes: number,
    observacoes: string
  ): Promise<void> {
    const novoConvidado = {
      nome,
      email,
      telefone,
      acompanhantes,
      observacoes,
      confirmado: true,
      dataConfirmacao: new Date().toISOString(),
    };

    // Adiciona o convidado ao array local
    this.convidados.push(novoConvidado);
    return Promise.resolve();
  }

  async excluirConvidado(id: string): Promise<boolean> {
    const index = this.convidados.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.convidados.splice(index, 1);
      return Promise.resolve(true);
    }
    return Promise.reject('Convidado não encontrado');
  }

  getEstatisticas(): Promise<EstatisticasConvidados> {
    const total = this.convidados.length;
    const confirmados = this.convidados.filter((c) => c.confirmado).length;
    const pendentes = total - confirmados;
    const convitesEnviados = this.convidados.filter(
      (c) => c.conviteEnviado
    ).length;

    // Total de pessoas (convidados principais + acompanhantes)
    const totalPessoas = this.convidados.reduce(
      (sum, c) => sum + 1 + c.acompanhantes.length,
      0
    );

    // Total de pessoas confirmadas
    const totalConfirmados = this.convidados.reduce((sum, c) => {
      const acompanhantesConfirmados = c.acompanhantes.filter(
        (a: any) => a.confirmado
      ).length;
      return sum + (c.confirmado ? 1 : 0) + acompanhantesConfirmados;
    }, 0);

    return Promise.resolve({
      total,
      confirmados,
      pendentes,
      convitesEnviados,
      totalPessoas,
      totalConfirmados,
    });
  }

  atualizarConvidado(convidado: Convidado): Promise<Convidado> {
    const index = this.convidados.findIndex((c) => c.id === convidado.id);
    if (index !== -1) {
      this.convidados[index] = { ...convidado };
      return Promise.resolve(this.convidados[index]);
    }
    return Promise.reject('Convidado não encontrado');
  }

  adicionarConvidado(convidado: Convidado): Promise<Convidado> {
    const novoConvidado: Convidado = {
      ...convidado,
      id: String(Date.now()),
    };
    this.convidados.push(novoConvidado);
    return Promise.resolve(novoConvidado);
  }

  confirmarPresenca(id: string, confirmado: boolean): Promise<boolean> {
    const index = this.convidados.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.convidados[index].confirmado = confirmado;
      return Promise.resolve(true);
    }
    return Promise.reject('Convidado não encontrado');
  }

  enviarConvite(id: string): Promise<boolean> {
    const index = this.convidados.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.convidados[index].conviteEnviado = true;
      return Promise.resolve(true);
    }
    return Promise.reject('Convidado não encontrado');
  }

  marcarConviteEnviado(id: string): Promise<boolean> {
    const index = this.convidados.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.convidados[index].conviteEnviado = true;
      this.convidados[index].dataEnvioConvite = new Date().toISOString();
      return Promise.resolve(true);
    }
    return Promise.reject('Convidado não encontrado');
  }
}
