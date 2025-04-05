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

      <div class="row g-4">
        <div class="col-md-6 col-lg-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <div class="mb-3">
                <i class="fas fa-users fa-3x text-primary"></i>
              </div>
              <h3 class="card-title">Convidados</h3>
              <p class="card-text">Gerencie a lista de convidados e confirme presenças</p>
              <a routerLink="/admin/convidados" class="btn btn-primary">Acessar</a>
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
              <p class="card-text">Gerencie a lista de presentes do casamento</p>
              <a routerLink="/admin/presentes" class="btn btn-primary">Acessar</a>
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
  styles: [`
    .text-primary {
      color: #8B5CF6 !important;
    }

    .btn-primary {
      background-color: #8B5CF6;
      border-color: #8B5CF6;
    }

    .btn-primary:hover, .btn-primary:focus {
      background-color: #7c4ff3;
      border-color: #7c4ff3;
    }

    .btn-outline-primary {
      color: #8B5CF6;
      border-color: #8B5CF6;
    }

    .btn-outline-primary:hover, .btn-outline-primary:focus {
      background-color: #8B5CF6;
      border-color: #8B5CF6;
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalFotos = 0;
  totalPresentes = 0;
  presentesReservados = 0;

  constructor(
    private presentesService: PresentesService,
    private fotosService: FotosService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Dashboard component inicializado');
    // Comentamos esta verificação para resolver o problema da tela em branco
    // if (!localStorage.getItem('adminLoggedIn')) {
    //   this.router.navigate(['/login']);
    // }
    this.loadStats();
  }

  async loadStats() {
    try {
      const presentes = await firstValueFrom(this.presentesService.getPresentes());
      this.totalPresentes = presentes.length;
      this.presentesReservados = presentes.filter(p => p.reservado).length;

      const fotos = await this.fotosService.getFotos();
      this.totalFotos = fotos.length;
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }

  logout() {
    console.log('Logout chamado');
    localStorage.removeItem('adminLoggedIn');
    this.router.navigate(['/login']);
  }
}