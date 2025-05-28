import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.key
    );
  }

  // Método para fazer upload de uma imagem
  async uploadImagem(arquivo: File, caminho: string): Promise<string> {
    // Cria um nome de arquivo único baseado na data atual e nome original
    const nomeArquivo = `${Date.now()}-${arquivo.name.replace(/\s+/g, '_')}`;
    const caminhoCompleto = `${caminho}/${nomeArquivo}`;

    // Faz o upload para o bucket do Supabase
    const { data, error } = await this.supabase.storage
      .from(environment.supabase.bucketName)
      .upload(caminhoCompleto, arquivo);

    if (error) {
      throw new Error(`Erro ao fazer upload: ${error.message}`);
    }

    // Retorna a URL pública do arquivo
    const { data: publicUrlData } = this.supabase.storage
      .from(environment.supabase.bucketName)
      .getPublicUrl(caminhoCompleto);

    return publicUrlData.publicUrl;
  }

  // Método para excluir uma imagem
  async excluirImagem(caminho: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(environment.supabase.bucketName)
      .remove([caminho]);

    if (error) {
      throw new Error(`Erro ao excluir imagem: ${error.message}`);
    }
  }

  // Método para buscar dados da tabela fotos
  async getFotos() {
    const { data, error } = await this.supabase
      .from('fotos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar fotos: ${error.message}`);
    }

    return data;
  }

  // Método para inserir uma nova foto
  async inserirFoto(foto: any) {
    const { data, error } = await this.supabase
      .from('fotos')
      .insert(foto)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao inserir foto: ${error.message}`);
    }

    return data;
  }

  // Método para excluir uma foto
  async excluirFoto(id: string) {
    const { error } = await this.supabase.from('fotos').delete().eq('id', id);

    if (error) {
      throw new Error(`Erro ao excluir foto: ${error.message}`);
    }
  }

  // Método para buscar presentes
  async getPresentes() {
    const { data, error } = await this.supabase
      .from('presentes')
      .select('*')
      .order('nome');

    if (error) {
      throw new Error(`Erro ao buscar presentes: ${error.message}`);
    }

    return data;
  }

  // Método para reservar um presente
  async reservarPresente(id: string, nomeConvidado: string) {
    const { data, error } = await this.supabase
      .from('presentes')
      .update({
        reservado: true,
        reservado_por: nomeConvidado,
        data_reserva: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao reservar presente: ${error.message}`);
    }

    return data;
  }

  // Método para adicionar um presente
  async adicionarPresente(presente: any) {
    const { data, error } = await this.supabase
      .from('presentes')
      .insert(presente)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao adicionar presente: ${error.message}`);
    }

    return data;
  }

  // Método para atualizar um presente
  async atualizarPresente(id: string, presente: any) {
    const { data, error } = await this.supabase
      .from('presentes')
      .update(presente)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar presente: ${error.message}`);
    }

    return data;
  }

  // Método para excluir um presente
  async excluirPresente(id: string) {
    const { error } = await this.supabase
      .from('presentes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao excluir presente: ${error.message}`);
    }
  }

  // Método para adicionar um convidado
  async adicionarConvidado(convidado: any) {
    const { data, error } = await this.supabase
      .from('convidados')
      .insert(convidado)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao adicionar convidado: ${error.message}`);
    }

    return data;
  }

  // Método para buscar convidados
  async getConvidados() {
    const { data, error } = await this.supabase
      .from('convidados')
      .select('*, acompanhantes(*)');

    if (error) {
      throw new Error(`Erro ao buscar convidados: ${error.message}`);
    }

    return data;
  }

  // Método para atualizar um convidado
  async atualizarConvidado(id: string, dados: any) {
    const { data, error } = await this.supabase
      .from('convidados')
      .update(dados)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar convidado: ${error.message}`);
    }

    return data;
  }

  // Método para excluir um convidado
  async excluirConvidado(id: string) {
    const { error } = await this.supabase
      .from('convidados')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao excluir convidado: ${error.message}`);
    }
  }

  // Método para buscar um convidado específico por ID
  async getConvidadoPorId(id: string) {
    const { data, error } = await this.supabase
      .from('convidados')
      .select('*, acompanhantes(*)')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Erro ao buscar convidado: ${error.message}`);
    }

    return data;
  }

  // Método para adicionar um acompanhante
  async adicionarAcompanhante(convidadoId: string, acompanhante: any) {
    const { data, error } = await this.supabase
      .from('acompanhantes')
      .insert({
        convidado_id: convidadoId,
        nome: acompanhante.nome,
        confirmado: acompanhante.confirmado || false,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao adicionar acompanhante: ${error.message}`);
    }

    return data;
  }

  // Método para remover todos os acompanhantes de um convidado
  async removerAcompanhantesConvidado(convidadoId: string) {
    const { error } = await this.supabase
      .from('acompanhantes')
      .delete()
      .eq('convidado_id', convidadoId);

    if (error) {
      throw new Error(`Erro ao remover acompanhantes: ${error.message}`);
    }
  }
}
