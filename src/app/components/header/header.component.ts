import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav
      class="navbar navbar-expand-lg navbar-dark fixed-top"
      [ngClass]="{
        'bg-dark-solid': isNotHomePage || scrolled,
        'bg-dark-transparent': !isNotHomePage && !scrolled
      }"
    >
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <span class="brand-text">K & K</span>
        </a>

        <button
          class="navbar-toggler"
          type="button"
          (click)="isMenuOpen = !isMenuOpen"
          [attr.aria-expanded]="isMenuOpen"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" [ngClass]="{ show: isMenuOpen }">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                Início
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/sobre" routerLinkActive="active">
                Sobre Nós
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/cerimonia"
                routerLinkActive="active"
              >
                Cerimônia
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/festa" routerLinkActive="active">
                Festa
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/presentes"
                routerLinkActive="active"
              >
                Presentes
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/fotos" routerLinkActive="active">
                Fotos
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/confirmar"
                routerLinkActive="active"
              >
                Confirmar
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      .navbar {
        transition: all 0.3s ease;
        padding: 1rem 0;
        z-index: 1050;
      }

      .bg-dark-transparent {
        background-color: rgba(26, 82, 118, 0.8) !important;
        backdrop-filter: blur(10px);
      }

      .bg-dark-solid {
        background-color: #1a5276 !important;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .navbar-brand {
        font-family: 'Playfair Display', serif;
        font-size: 1.8rem;
        font-weight: 700;
      }

      .brand-text {
        color: white;
        text-decoration: none;
      }

      .nav-link {
        font-weight: 500;
        padding: 0.5rem 1rem;
        transition: color 0.3s;
        color: white !important;
      }

      .nav-link:hover {
        color: #2e86c1 !important;
      }

      .nav-link.active {
        font-weight: 700;
        color: #2e86c1 !important;
        border-bottom: 2px solid #2e86c1;
      }

      .navbar-toggler {
        border: none;
        outline: none;
        border-color: rgba(255, 255, 255, 0.3);
      }

      .navbar-toggler:focus {
        box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
      }

      @media (max-width: 992px) {
        .navbar-collapse {
          background-color: rgba(26, 82, 118, 0.95);
          padding: 1rem;
          border-radius: 0.5rem;
          margin-top: 0.5rem;
          backdrop-filter: blur(10px);
        }
      }
    `,
  ],
})
export class HeaderComponent {
  scrolled = false;
  isMenuOpen = false;
  isNotHomePage = false;

  constructor(private router: Router) {}

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll.bind(this));
    this.checkCurrentRoute();

    // Detecta mudanças de rota
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkCurrentRoute();
        this.isMenuOpen = false; // Fecha o menu mobile ao navegar
      });
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  checkCurrentRoute() {
    this.isNotHomePage = this.router.url !== '/';
  }

  onScroll() {
    this.scrolled = window.scrollY > 50;
  }
}
