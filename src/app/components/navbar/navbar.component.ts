import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <h1>Wedding</h1>
        <button class="hamburger" (click)="toggleMenu()" [class.active]="isMenuOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <ul class="nav-links" [class.active]="isMenuOpen">
        <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a></li>
        <li><a routerLink="/gallery" routerLinkActive="active">Galeria</a></li>
        <li><a routerLink="/wishlist" routerLinkActive="active">Lista de Desejos</a></li>
      </ul>
    </nav>
  `
})
export class NavbarComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}