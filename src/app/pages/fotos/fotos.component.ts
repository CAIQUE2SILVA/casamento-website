import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FotosService } from '../../services/fotos.service';

interface Foto {
  id: string;
  titulo: string;
  descricao?: string;
  url: string;
}

@Component({
  selector: 'app-fotos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Galeria de Fotos</h1>

      <div class="loading" *ngIf="loading">
        Carregando fotos...
      </div>

      <div class="empty-message" *ngIf="!loading && fotos.length === 0">
        Ainda não temos fotos para mostrar.
      </div>

      <div class="gallery" *ngIf="!loading && fotos.length > 0">
        <div class="gallery-item" *ngFor="let foto of fotos">
          <img [src]="foto.url" [alt]="foto.titulo" (click)="openModal(foto)">
        </div>
      </div>

      <div class="modal" *ngIf="selectedFoto" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <span class="close" (click)="closeModal()">&times;</span>
          <img [src]="selectedFoto.url" [alt]="selectedFoto.titulo">
          <div class="modal-info">
            <h3>{{ selectedFoto.titulo }}</h3>
            <p *ngIf="selectedFoto.descricao">{{ selectedFoto.descricao }}</p>
          </div>
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

    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .gallery-item {
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.03);
      }

      img {
        width: 100%;
        height: 250px;
        object-fit: cover;
        display: block;
      }
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      position: relative;
      max-width: 90%;
      max-height: 90%;

      img {
        max-width: 100%;
        max-height: 80vh;
        display: block;
        border-radius: 4px;
      }
    }

    .close {
      position: absolute;
      top: -30px;
      right: 0;
      color: white;
      font-size: 2rem;
      cursor: pointer;
    }

    .modal-info {
      background-color: white;
      padding: 1rem;
      border-radius: 0 0 4px 4px;

      h3 {
        margin-top: 0;
      }

      p {
        margin-bottom: 0;
        color: #666;
      }
    }
  `]
})
export class FotosComponent implements OnInit {
  fotos: Foto[] = [];
  loading = true;
  selectedFoto: Foto | null = null;

  constructor(private fotosService: FotosService) {}

  ngOnInit() {
    this.loadFotos();
  }

  async loadFotos() {
    this.loading = true;
    try {
      this.fotos = await this.fotosService.getFotos();
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
    } finally {
      this.loading = false;
    }
  }

  openModal(foto: Foto) {
    this.selectedFoto = foto;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.selectedFoto = null;
    document.body.style.overflow = 'auto';
  }
}