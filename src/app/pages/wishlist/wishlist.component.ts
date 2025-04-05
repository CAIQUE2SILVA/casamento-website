import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentesService } from '../../services/presentes.service';
import { firstValueFrom } from 'rxjs';

interface Presente {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  imagem?: string;
  disponivel: boolean;
  reservadoPor?: string;
  link?: string;
}

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>Lista de Desejos</h1>

      <div class="loading" *ngIf="loading">
        Carregando lista de desejos...
      </div>

      <div class="empty-message" *ngIf="!loading && presentes.length === 0">
        Ainda não temos itens na lista de desejos.
      </div>

      <div class="wishlist-grid" *ngIf="!loading && presentes.length > 0">
        <div class="wishlist-item" *ngFor="let presente of presentes">
          <div class="wishlist-image">
            <img [src]="presente.imagem" [alt]="presente.nome">
            <div class="status-badge" [class.reserved]="!presente.disponivel">
              {{ presente.disponivel ? 'Disponível' : 'Reservado' }}
            </div>
          </div>

          <div class="wishlist-info">
            <h3>{{ presente.nome }}</h3>
            <p class="price">R$ {{ presente.preco | number:'1.2-2' }}</p>

            <div class="actions" *ngIf="presente.disponivel">
              <button class="reserve-btn" (click)="openReserveModal(presente)">Reservar</button>
              <a [href]="presente.link" target="_blank" class="buy-btn" *ngIf="presente.link">Comprar</a>
            </div>

            <p class="reserved-by" *ngIf="!presente.disponivel">
              Reservado por {{ presente.reservadoPor }}
            </p>
          </div>
        </div>
      </div>

      <div class="modal" *ngIf="selectedPresente" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <span class="close" (click)="closeModal()">&times;</span>
          <h2>Reservar Presente</h2>

          <div class="modal-item-info">
            <img [src]="selectedPresente.imagem" [alt]="selectedPresente.nome">
            <div>
              <h3>{{ selectedPresente.nome }}</h3>
              <p class="price">R$ {{ selectedPresente.preco | number:'1.2-2' }}</p>
            </div>
          </div>

          <form (ngSubmit)="reservePresente()">
            <div class="form-group">
              <label for="nome">Seu Nome</label>
              <input type="text" id="nome" [(ngModel)]="reservationName" name="nome" required>
            </div>

            <button type="submit" [disabled]="!reservationName">Confirmar Reserva</button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 80px auto 2rem;
      padding: 0 1rem;
    }

    h1 {
      text-align: center;
      margin-bottom: 2rem;
    }

    .loading, .empty-message {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .wishlist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .wishlist-item {
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-5px);
      }
    }

    .wishlist-image {
      position: relative;
      height: 200px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .status-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background-color: #2ecc71;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        font-size: 0.875rem;

        &.reserved {
          background-color: #e74c3c;
        }
      }
    }

    .wishlist-info {
      padding: 1.5rem;

      h3 {
        margin-top: 0;
        margin-bottom: 0.5rem;
      }

      .price {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1a5276;
        margin-bottom: 1.5rem;
      }

      .actions {
        display: flex;
        gap: 1rem;
      }

      .reserve-btn, .buy-btn {
        flex: 1;
        padding: 0.75rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        text-align: center;
        text-decoration: none;
        transition: background-color 0.3s;
      }

      .reserve-btn {
        background-color: #1a5276;
        color: white;

        &:hover {
          background-color: #154360;
        }
      }

      .buy-btn {
        background-color: #2ecc71;
        color: white;

        &:hover {
          background-color: #27ae60;
        }
      }

      .reserved-by {
        font-style: italic;
        color: #666;
      }
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background-color: white;
      border-radius: 8px;
      padding: 2rem;
      width: 90%;
      max-width: 500px;
      position: relative;

      h2 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        text-align: center;
      }
    }

    .close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: 1.5rem;
      cursor: pointer;
    }

    .modal-item-info {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;

      img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 4px;
      }

      h3 {
        margin-top: 0;
        margin-bottom: 0.5rem;
      }

      .price {
        font-weight: 600;
        color: #1a5276;
      }
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    button[type="submit"] {
      width: 100%;
      padding: 0.75rem;
      background-color: #1a5276;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #154360;
      }

      &:disabled {
        background-color: #95a5a6;
        cursor: not-allowed;
      }
    }
  `]
})
export class WishlistComponent implements OnInit {
  presentes: Presente[] = [];
  loading = true;
  selectedPresente: Presente | null = null;
  reservationName = '';

  constructor(private presentesService: PresentesService) {}

  ngOnInit() {
    this.loadPresentes();
  }

  async loadPresentes() {
    this.loading = true;
    try {
      const presentes = await firstValueFrom(this.presentesService.getPresentes());
      this.presentes = presentes.map(p => ({
        id: p.id,
        nome: p.nome,
        descricao: p.descricao,
        preco: p.preco,
        imagem: 'assets/images/gift-placeholder.jpg', // Imagem padrão
        disponivel: !p.reservado,
        reservadoPor: p.reservadoPor || ''
      }));
    } catch (error) {
      console.error('Erro ao carregar presentes:', error);
    } finally {
      this.loading = false;
    }
  }

  openReserveModal(presente: any) {
    this.selectedPresente = presente;
    this.reservationName = '';
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.selectedPresente = null;
    document.body.style.overflow = 'auto';
  }

  async reservePresente() {
    if (!this.selectedPresente || !this.selectedPresente.id || !this.reservationName) return;

    try {
      await firstValueFrom(this.presentesService.reservarPresente(this.selectedPresente.id, this.reservationName));
      this.closeModal();

      // Atualizar o item na lista local
      const index = this.presentes.findIndex(p => p.id === this.selectedPresente?.id);
      if (index !== -1) {
        this.presentes[index] = {
          ...this.presentes[index],
          disponivel: false,
          reservadoPor: this.reservationName
        };
      }
    } catch (error) {
      console.error('Erro ao reservar presente:', error);
    }
  }
}