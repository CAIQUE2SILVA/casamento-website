import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>Painel Admin</h2>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/admin/presentes" routerLinkActive="active">Presentes</a>
          <a routerLink="/admin/fotos" routerLinkActive="active">Fotos</a>
          <a routerLink="/admin/convidados" routerLinkActive="active">Convidados</a>
          <a href="javascript:void(0)" (click)="logout()" class="logout">Sair</a>
        </nav>
      </aside>

      <main class="content">
        <header class="content-header">
          <h1>Área Administrativa</h1>
          <button (click)="logout()" class="logout-btn">Sair</button>
        </header>

        <div class="content-body">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 250px;
      background-color: #1a5276;
      color: white;
      padding: 1rem 0;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    }

    .sidebar-header {
      padding: 0 1.5rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      h2 {
        margin: 0;
        font-size: 1.5rem;
      }
    }

    .sidebar-nav {
      padding: 1.5rem 0;

      a {
        display: block;
        padding: 0.75rem 1.5rem;
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        transition: all 0.3s;

        &:hover, &.active {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
        }

        &.logout {
          margin-top: 2rem;
          color: #e74c3c;

          &:hover {
            background-color: #e74c3c;
            color: white;
          }
        }
      }
    }

    .content {
      flex: 1;
      background-color: #f5f5f5;
      overflow-y: auto;
    }

    .content-header {
      background-color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;

      h1 {
        margin: 0;
        font-size: 1.5rem;
      }

      .logout-btn {
        padding: 0.5rem 1rem;
        background-color: #e74c3c;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          background-color: #c0392b;
        }
      }
    }

    .content-body {
      padding: 2rem;
      flex: 1;
    }

    @media (max-width: 768px) {
      .admin-layout {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
      }
    }
  `]
})
export class AdminLayoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }
}