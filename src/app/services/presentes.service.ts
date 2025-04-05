import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';
import { firstValueFrom } from 'rxjs';

export interface Presente {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  reservado: boolean;
  reservadoPor?: string;
}

export interface AddPresenteDto {
  nome: string;
  descricao?: string;
  preco: number;
  imagem?: string;
  link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PresentesService {
  private presentes: Presente[] = [
    {
      id: '1',
      nome: 'Panela de Pressão',
      descricao: 'Panela de pressão elétrica com timer digital',
      preco: 299.90,
      reservado: false
    },
    {
      id: '2',
      nome: 'Jogo de Panelas',
      descricao: 'Conjunto com 5 panelas antiaderentes',
      preco: 399.90,
      reservado: false
    },
    {
      id: '3',
      nome: 'Air Fryer',
      descricao: 'Air Fryer com capacidade de 5.5L',
      preco: 499.90,
      reservado: false
    }
  ];

  constructor(private supabaseService: SupabaseService) { }

  getPresentes(): Observable<Presente[]> {
    // Primeiro retorna dados locais rapidamente
    const localData$ = of(this.presentes).pipe(delay(100));

    // Depois tenta buscar dados do Supabase
    this.carregarPresentesSupabase();

    return localData$;
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
        reservadoPor: p.reservado_por
      }));
    } catch (error) {
      console.error('Erro ao carregar presentes do Supabase:', error);
    }
  }

  async reservarPresenteAsync(id: string, nomeConvidado: string): Promise<Presente> {
    try {
      const presente = await this.supabaseService.reservarPresente(id, nomeConvidado);

      // Atualiza o presente local também
      const index = this.presentes.findIndex(p => p.id === id);
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
        reservadoPor: nomeConvidado
      };
    } catch (error) {
      console.error('Erro ao reservar presente:', error);
      throw error;
    }
  }

  // Versão Observable para compatibilidade
  reservarPresente(id: string, nomeConvidado: string): Observable<Presente> {
    return new Observable(subscriber => {
      this.reservarPresenteAsync(id, nomeConvidado)
        .then(presente => {
          subscriber.next(presente);
          subscriber.complete();
        })
        .catch(error => {
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
        reservado: false
      });

      const presenteFormatado: Presente = {
        id: novoPresente.id,
        nome: novoPresente.nome,
        descricao: novoPresente.descricao || '',
        preco: novoPresente.preco,
        reservado: false
      };

      // Adiciona à lista local
      this.presentes.push(presenteFormatado);

      return presenteFormatado;
    } catch (error) {
      console.error('Erro ao adicionar presente:', error);
      throw error;
    }
  }

  // Versão Observable para compatibilidade
  addPresente(presente: AddPresenteDto): Observable<Presente> {
    return new Observable(subscriber => {
      this.addPresenteAsync(presente)
        .then(novoPresente => {
          subscriber.next(novoPresente);
          subscriber.complete();
        })
        .catch(error => {
          subscriber.error(error);
        });
    });
  }

  async deletePresenteAsync(id: string): Promise<boolean> {
    try {
      await this.supabaseService.excluirPresente(id);

      // Remove da lista local
      const index = this.presentes.findIndex(p => p.id === id);
      if (index !== -1) {
        this.presentes.splice(index, 1);
      }

      return true;
    } catch (error) {
      console.error('Erro ao excluir presente:', error);
      throw error;
    }
  }

  // Versão Observable para compatibilidade
  deletePresente(id: string): Observable<boolean> {
    return new Observable(subscriber => {
      this.deletePresenteAsync(id)
        .then(result => {
          subscriber.next(result);
          subscriber.complete();
        })
        .catch(error => {
          subscriber.error(error);
        });
    });
  }
}
