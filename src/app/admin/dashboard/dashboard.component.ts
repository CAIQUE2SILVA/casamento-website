import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PresentesService, Presente } from '../../services/presentes.service';
import { FotosService, Foto } from '../../services/fotos.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Painel Administrativo</h1>
        <div>
          <a routerLink="/" class="btn btn-outline-primary me-2">
            <i class="fas fa-home me-2"></i>Voltar para o site
          </a>
          <button (click)="logout()" class="btn btn-outline-danger">
            <i class="fas fa-sign-out-alt me-2"></i>Sair
          </button>
        </div>
      </div>

      <!-- Cards de estatísticas -->
      <div class="row g-4 mb-4" *ngIf="!loading">
        <div class="col-md-4">
          <div class="card bg-info text-white h-100">
            <div class="card-body text-center">
              <div class="mb-3">
                <i class="fas fa-gift fa-3x"></i>
              </div>
              <h3 class="card-title">{{ totalPresentes }}</h3>
              <p class="card-text">Presentes Cadastrados</p>
              <small>{{ presentesReservados }} reservados</small>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card bg-success text-white h-100">
            <div class="card-body text-center">
              <div class="mb-3">
                <i class="fas fa-image fa-3x"></i>
              </div>
              <h3 class="card-title">{{ totalFotos }}</h3>
              <p class="card-text">Fotos na Galeria</p>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card bg-warning text-white h-100">
            <div class="card-body text-center">
              <div class="mb-3">
                <i class="fas fa-users fa-3x"></i>
              </div>
              <h3 class="card-title">0</h3>
              <p class="card-text">Convidados</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
        <p class="mt-2">Carregando estatísticas...</p>
      </div>

      <!-- Menu de navegação -->
      <div class="row g-4">
        <div class="col-md-6 col-lg-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <div class="mb-3">
                <i class="fas fa-users fa-3x text-primary"></i>
              </div>
              <h3 class="card-title">Convidados</h3>
              <p class="card-text">
                Gerencie a lista de convidados e confirme presenças
              </p>
              <a routerLink="/admin/convidados" class="btn btn-primary"
                >Acessar</a
              >
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <div class="mb-3">
                <i class="fas fa-gift fa-3x text-primary"></i>
              </div>
              <h3 class="card-title">Presentes</h3>
              <p class="card-text">
                Gerencie a lista de presentes do casamento
              </p>
              <a routerLink="/admin/presentes" class="btn btn-primary"
                >Acessar</a
              >
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <div class="mb-3">
                <i class="fas fa-image fa-3x text-primary"></i>
              </div>
              <h3 class="card-title">Fotos</h3>
              <p class="card-text">Gerencie as fotos do site</p>
              <a routerLink="/admin/fotos" class="btn btn-primary">Acessar</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .text-primary {
        color: #2e86c1 !important;
      }

      .btn-primary {
        background-color: #2e86c1;
        border-color: #2e86c1;
      }

      .btn-primary:hover,
      .btn-primary:focus {
        background-color: #21629c;
        border-color: #21629c;
      }

      .btn-outline-primary {
        color: #2e86c1;
        border-color: #2e86c1;
      }

      .btn-outline-primary:hover,
      .btn-outline-primary:focus {
        background-color: #2e86c1;
        border-color: #2e86c1;
        color: white;
      }

      .btn-outline-danger {
        color: #dc3545;
        border-color: #dc3545;
      }

      .btn-outline-danger:hover {
        background-color: #dc3545;
        border-color: #dc3545;
        color: white;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  totalFotos = 0;
  totalPresentes = 0;
  presentesReservados = 0;
  loading = true;

  constructor(
    private presentesService: PresentesService,
    private fotosService: FotosService,
    private router: Router
  ) {}

  ngOnInit() {
    // Carregar estatísticas com delay para evitar problemas
    setTimeout(() => {
      this.loadStats();
    }, 100);
  }

  async loadStats() {
    this.loading = true;

    try {
      // Carregar presentes com timeout
      const presentesPromise = Promise.race([
        firstValueFrom(this.presentesService.getPresentes()),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 5000)
        ),
      ]);

      const presentes = (await presentesPromise) as Presente[];
      this.totalPresentes = presentes?.length || 0;
      this.presentesReservados =
        presentes?.filter((p) => p.reservado).length || 0;
    } catch (error) {
      console.error('Erro ao carregar presentes:', error);
      this.totalPresentes = 0;
      this.presentesReservados = 0;
    }

    try {
      // Carregar fotos com timeout
      const fotosPromise = Promise.race([
        this.fotosService.getFotos(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 5000)
        ),
      ]);

      const fotos = (await fotosPromise) as Foto[];
      this.totalFotos = fotos?.length || 0;
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
      this.totalFotos = 0;
    }

    this.loading = false;
  }

  logout() {
    localStorage.removeItem('adminLoggedIn');

    // Usar setTimeout para evitar problemas de navegação
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 100);
  }
}
