import { Injectable } from '@angular/core';
import { EmailService } from './email.service';
import { SupabaseService } from './supabase.service';
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
  constructor(
    private emailService: EmailService,
    private supabase: SupabaseService
  ) {}

  // Método para obter todos os convidados
  async getConvidados(): Promise<Convidado[]> {
    try {
      return await this.supabase.getConvidados();
    } catch (error) {
      console.error('Erro ao buscar convidados:', error);
      return [];
    }
  }

  // Método para adicionar um novo convidado
  async adicionarConvidado(convidado: Convidado): Promise<Convidado> {
    try {
      // Extrair acompanhantes antes de salvar o convidado principal
      const acompanhantes = convidado.acompanhantes || [];
      const convidadoSemAcompanhantes = { ...convidado };

      // Remover acompanhantes do objeto (será salvo separadamente)
      if ('acompanhantes' in convidadoSemAcompanhantes) {
        const { acompanhantes: _, ...resto } = convidadoSemAcompanhantes;
        const convidadoParaSalvar = resto;

        // Salvar o convidado principal primeiro
        const convidadoSalvo = await this.supabase.adicionarConvidado(
          convidadoParaSalvar
        );

        // Depois salvar os acompanhantes se houver
        if (acompanhantes.length > 0) {
          for (const acompanhante of acompanhantes) {
            await this.supabase.adicionarAcompanhante(
              convidadoSalvo.id,
              acompanhante
            );
          }
          // Buscar o convidado completo com acompanhantes
          const convidadoCompleto = await this.supabase.getConvidadoPorId(
            convidadoSalvo.id
          );
          return convidadoCompleto;
        }

        return { ...convidadoSalvo, acompanhantes: [] };
      }

      // Se não tem acompanhantes, salvar diretamente
      const convidadoSalvo = await this.supabase.adicionarConvidado(
        convidadoSemAcompanhantes
      );
      return { ...convidadoSalvo, acompanhantes: [] };
    } catch (error) {
      console.error('Erro ao adicionar convidado:', error);
      throw error;
    }
  }

  // Método para atualizar um convidado
  async atualizarConvidado(convidado: Convidado): Promise<Convidado> {
    try {
      const acompanhantes = convidado.acompanhantes || [];
      const convidadoSemAcompanhantes = { ...convidado };

      // Remover acompanhantes do objeto
      if ('acompanhantes' in convidadoSemAcompanhantes) {
        const { acompanhantes: _, ...resto } = convidadoSemAcompanhantes;

        // Atualizar convidado principal
        const convidadoAtualizado = await this.supabase.atualizarConvidado(
          convidado.id!,
          resto
        );

        // Atualizar acompanhantes (remover existentes e adicionar novos)
        await this.supabase.removerAcompanhantesConvidado(convidado.id!);

        if (acompanhantes.length > 0) {
          for (const acompanhante of acompanhantes) {
            await this.supabase.adicionarAcompanhante(
              convidado.id!,
              acompanhante
            );
          }
        }

        // Buscar o convidado completo
        return await this.supabase.getConvidadoPorId(convidado.id!);
      }

      // Se não tem acompanhantes, atualizar diretamente
      const convidadoAtualizado = await this.supabase.atualizarConvidado(
        convidado.id!,
        convidadoSemAcompanhantes
      );
      return { ...convidadoAtualizado, acompanhantes: [] };
    } catch (error) {
      console.error('Erro ao atualizar convidado:', error);
      throw error;
    }
  }

  // Método para excluir um convidado
  async excluirConvidado(id: string): Promise<boolean> {
    try {
      await this.supabase.excluirConvidado(id);
      return true;
    } catch (error) {
      console.error('Erro ao excluir convidado:', error);
      throw error;
    }
  }

  async confirmarPresenca(id: string, confirmado: boolean): Promise<boolean> {
    try {
      const dados = {
        confirmado,
        data_confirmacao: confirmado ? new Date().toISOString() : null,
      };
      await this.supabase.atualizarConvidado(id, dados);
      return true;
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      throw error;
    }
  }

  async marcarConviteEnviado(id: string): Promise<boolean> {
    try {
      const dados = {
        convite_enviado: true,
        data_envio_convite: new Date().toISOString(),
      };
      await this.supabase.atualizarConvidado(id, dados);
      return true;
    } catch (error) {
      console.error('Erro ao marcar convite como enviado:', error);
      throw error;
    }
  }

  async getEstatisticas(): Promise<EstatisticasConvidados> {
    try {
      const convidados = await this.getConvidados();

      const total = convidados.length;
      const confirmados = convidados.filter((c) => c.confirmado).length;
      const pendentes = total - confirmados;
      const convitesEnviados = convidados.filter(
        (c) => c.convite_enviado
      ).length;

      // Total de pessoas (convidados principais + acompanhantes)
      const totalPessoas = convidados.reduce(
        (sum, c) => sum + 1 + (c.acompanhantes?.length || 0),
        0
      );

      // Total de pessoas confirmadas
      const totalConfirmados = convidados.reduce((sum, c) => {
        const acompanhantesConfirmados = (c.acompanhantes || []).filter(
          (a) => a.confirmado
        ).length;
        return sum + (c.confirmado ? 1 : 0) + acompanhantesConfirmados;
      }, 0);

      return {
        total,
        confirmados,
        pendentes,
        convitesEnviados,
        totalPessoas,
        totalConfirmados,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      return {
        total: 0,
        confirmados: 0,
        pendentes: 0,
        convitesEnviados: 0,
        totalPessoas: 0,
        totalConfirmados: 0,
      };
    }
  }
}
