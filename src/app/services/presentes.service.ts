import { Injectable } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';
import { firstValueFrom } from 'rxjs';

export interface Presente {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  reservado: boolean;
  reservadoPor?: string;
  imagem: string;
}

export interface AddPresenteDto {
  nome: string;
  descricao?: string;
  preco: number;
  imagem?: string;
  link?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PresentesService {
  private presentes: Presente[] = [];
  private presentesSubject = new BehaviorSubject<Presente[]>([]);

  constructor(private supabaseService: SupabaseService) {}

  getPresentes(): Observable<Presente[]> {
    // Se já carregado, devolve BehaviorSubject
    if (this.presentes.length > 0) {
      return this.presentesSubject.asObservable();
    }

    // Caso contrário, faz a requisição ao Supabase
    this.carregarPresentesSupabase();
    return this.presentesSubject.asObservable();
  }

  private async carregarPresentesSupabase() {
    try {
      const presentesSupabase = await this.supabaseService.getPresentes();
      // Atualiza a lista local quando os dados do Supabase forem carregados
      this.presentes = presentesSupabase.map((p: any) => ({
        id: p.id,
        nome: p.nome,
        descricao: p.descricao || '',
        preco: p.preco,
        reservado: p.reservado || false,
        reservadoPor: p.reservado_por,
        imagem: p.imagem || '',
      }));

      this.presentesSubject.next(this.presentes);
    } catch (error) {
      console.error('Erro ao carregar presentes do Supabase:', error);
    }
  }

  async reservarPresenteAsync(
    id: string,
    nomeConvidado: string
  ): Promise<Presente> {
    try {
      const presente = await this.supabaseService.reservarPresente(
        id,
        nomeConvidado
      );

      // Atualiza o presente local também
      const index = this.presentes.findIndex((p) => p.id === id);
      if (index !== -1) {
        this.presentes[index].reservado = true;
        this.presentes[index].reservadoPor = nomeConvidado;
      }

      return {
        id: presente.id,
        nome: presente.nome,
        descricao: presente.descricao || '',
        preco: presente.preco,
        reservado: true,
        reservadoPor: nomeConvidado,
        imagem: presente.imagem || '',
      };
    } catch (error) {
      console.error('Erro ao reservar presente:', error);
      throw error;
    }
  }

  // Versão Observable para compatibilidade
  reservarPresente(id: string, nomeConvidado: string): Observable<Presente> {
    return new Observable((subscriber) => {
      this.reservarPresenteAsync(id, nomeConvidado)
        .then((presente) => {
          subscriber.next(presente);
          subscriber.complete();
        })
        .catch((error) => {
          subscriber.error(error);
        });
    });
  }

  async addPresenteAsync(presente: AddPresenteDto): Promise<Presente> {
    try {
      const novoPresente = await this.supabaseService.adicionarPresente({
        nome: presente.nome,
        descricao: presente.descricao || '',
        preco: presente.preco,
        imagem: presente.imagem || '',
        link: presente.link || '',
        reservado: false,
      });

      const presenteFormatado: Presente = {
        id: novoPresente.id,
        nome: novoPresente.nome,
        descricao: novoPresente.descricao || '',
        preco: novoPresente.preco,
        reservado: false,
        imagem: novoPresente.imagem || '',
      };

      // Adiciona à lista local
      this.presentes.push(presenteFormatado);
      this.presentesSubject.next(this.presentes);

      return presenteFormatado;
    } catch (error) {
      console.error('Erro ao adicionar presente:', error);
      throw error;
    }
  }

  // Versão Observable para compatibilidade
  addPresente(presente: AddPresenteDto): Observable<Presente> {
    return new Observable((subscriber) => {
      this.addPresenteAsync(presente)
        .then((novoPresente) => {
          subscriber.next(novoPresente);
          subscriber.complete();
        })
        .catch((error) => {
          subscriber.error(error);
        });
    });
  }

  async deletePresenteAsync(id: string): Promise<boolean> {
    try {
      await this.supabaseService.excluirPresente(id);

      // Remove da lista local
      const index = this.presentes.findIndex((p) => p.id === id);
      if (index !== -1) {
        this.presentes.splice(index, 1);
        this.presentesSubject.next(this.presentes);
      }

      return true;
    } catch (error) {
      console.error('Erro ao excluir presente:', error);
      throw error;
    }
  }

  // Versão Observable para compatibilidade
  deletePresente(id: string): Observable<boolean> {
    return new Observable((subscriber) => {
      this.deletePresenteAsync(id)
        .then((result) => {
          subscriber.next(result);
          subscriber.complete();
        })
        .catch((error) => {
          subscriber.error(error);
        });
    });
  }

  async updatePresenteAsync(
    id: string,
    presente: AddPresenteDto
  ): Promise<Presente> {
    try {
      const presenteAtualizado = await this.supabaseService.atualizarPresente(
        id,
        {
          nome: presente.nome,
          descricao: presente.descricao || '',
          preco: presente.preco,
          imagem: presente.imagem || '',
          link: presente.link || '',
        }
      );

      const presenteFormatado: Presente = {
        id: presenteAtualizado.id,
        nome: presenteAtualizado.nome,
        descricao: presenteAtualizado.descricao || '',
        preco: presenteAtualizado.preco,
        reservado: presenteAtualizado.reservado || false,
        reservadoPor: presenteAtualizado.reservado_por,
        imagem: presenteAtualizado.imagem || '',
      };

      // Atualiza na lista local
      const index = this.presentes.findIndex((p) => p.id === id);
      if (index !== -1) {
        this.presentes[index] = presenteFormatado;
        this.presentesSubject.next(this.presentes);
      }

      return presenteFormatado;
    } catch (error) {
      console.error('Erro ao atualizar presente:', error);
      throw error;
    }
  }

  // Versão Observable para compatibilidade
  updatePresente(id: string, presente: AddPresenteDto): Observable<Presente> {
    return new Observable((subscriber) => {
      this.updatePresenteAsync(id, presente)
        .then((presenteAtualizado) => {
          subscriber.next(presenteAtualizado);
          subscriber.complete();
        })
        .catch((error) => {
          subscriber.error(error);
        });
    });
  }
}
