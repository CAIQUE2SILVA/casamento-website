import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top" [ngClass]="{'bg-dark-transparent': scrolled, 'bg-transparent': !scrolled}">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <span class="text-white">K & K</span>
        </a>

        <button class="navbar-toggler" type="button"
                (click)="isMenuOpen = !isMenuOpen"
                [attr.aria-expanded]="isMenuOpen">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" [ngClass]="{'show': isMenuOpen}">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link text-white" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                Início
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white" routerLink="/sobre" routerLinkActive="active">
                Sobre Nós
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white" routerLink="/cerimonia" routerLinkActive="active">
                Cerimônia
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white" routerLink="/festa" routerLinkActive="active">
                Festa
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white" routerLink="/presentes" routerLinkActive="active">
                Presentes
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white" routerLink="/fotos" routerLinkActive="active">
                Fotos
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white" routerLink="/confirmar" routerLinkActive="active">
                Confirmar
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      transition: all 0.3s ease;
      padding: 1rem 0;
    }

    .bg-dark-transparent {
      background-color: rgba(0, 0, 0, 0.7) !important;
    }

    .navbar-brand {
      font-family: 'Playfair Display', serif;
      font-size: 1.8rem;
      font-weight: 700;
    }

    .nav-link {
      font-weight: 500;
      padding: 0.5rem 1rem;
      transition: color 0.3s;
    }

    .nav-link.active {
      font-weight: 700;
      text-decoration: underline;
    }

    .navbar-toggler {
      border: none;
      outline: none;
    }

    @media (max-width: 992px) {
      .navbar-collapse {
        background-color: rgba(0, 0, 0, 0.9);
        padding: 1rem;
        border-radius: 0.5rem;
        margin-top: 0.5rem;
      }
    }
  `]
})
export class HeaderComponent {
  scrolled = false;
  isMenuOpen = false;

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  onScroll() {
    this.scrolled = window.scrollY > 50;
  }
}