import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Foto {
  id: string;
  titulo: string;
  descricao?: string;
  url: string;
  data?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FotosService {
  private fotos: Foto[] = [
    {
      id: '1',
      titulo: 'Nosso Noivado',
      descricao: 'Momento especial do nosso noivado',
      url: 'assets/images/fotos/noivado.jpg',
      data: '2023-01-15'
    },
    {
      id: '2',
      titulo: 'Primeiro Encontro',
      url: 'assets/images/fotos/encontro.jpg',
      data: '2022-06-10'
    }
  ];

  constructor(private supabaseService: SupabaseService) {}

  async getFotos(): Promise<Foto[]> {
    try {
      const fotosSupabase = await this.supabaseService.getFotos();
      return fotosSupabase.map((foto: any) => ({
        id: foto.id,
        titulo: foto.titulo,
        descricao: foto.descricao,
        url: foto.url,
        data: foto.created_at ? new Date(foto.created_at).toISOString().split('T')[0] : undefined
      }));
    } catch (error) {
      console.error('Erro ao buscar fotos do Supabase:', error);
      // Fallback para dados locais
      return Promise.resolve(this.fotos);
    }
  }

  async uploadFoto(file: File, titulo: string, descricao?: string): Promise<Foto> {
    try {
      // Upload da imagem
      const url = await this.supabaseService.uploadImagem(file, 'fotos');

      // Extrair o caminho da URL para poder excluir depois
      const urlParts = url.split('/');
      const caminhoStorage = urlParts[urlParts.length - 2] + '/' + urlParts[urlParts.length - 1];

      // Inserir registro no banco
      const novaFoto = await this.supabaseService.inserirFoto({
        titulo,
        descricao,
        url,
        caminho_storage: caminhoStorage
      });

      return {
        id: novaFoto.id,
        titulo: novaFoto.titulo,
        descricao: novaFoto.descricao,
        url: novaFoto.url,
        data: novaFoto.created_at ? new Date(novaFoto.created_at).toISOString().split('T')[0] : undefined
      };
    } catch (error) {
      console.error('Erro no upload da foto:', error);
      throw error;
    }
  }

  async deleteFoto(foto: Foto): Promise<boolean> {
    try {
      // Buscar o registro no banco para obter o caminho de storage
      const fotosSupabase = await this.supabaseService.getFotos();
      const fotoSupabase = fotosSupabase.find((f: any) => f.id === foto.id);

      if (fotoSupabase && fotoSupabase.caminho_storage) {
        // Primeiro excluir a imagem do storage
        await this.supabaseService.excluirImagem(fotoSupabase.caminho_storage);
      }

      // Excluir o registro do banco
      await this.supabaseService.excluirFoto(foto.id);
      return true;
    } catch (error) {
      console.error('Erro ao excluir foto:', error);
      throw error;
    }
  }
}
