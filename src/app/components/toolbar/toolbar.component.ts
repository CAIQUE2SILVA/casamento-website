import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WindowService } from '../../services/window.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="toolbar">
      <div class="toolbar-container">
        <div class="logo" *ngIf="isMobile">
          <h1>G & H</h1>
        </div>

        <button class="menu-toggle" *ngIf="isMobile" (click)="toggleMenu()">
          <span [class.active]="menuOpen"></span>
        </button>

        <nav class="nav-links" [class.open]="menuOpen">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu()">Mensagem Inicial</a>
          <a routerLink="/sobre" routerLinkActive="active" (click)="closeMenu()">Sobre Nós</a>
          <a routerLink="/cerimonia" routerLinkActive="active" (click)="closeMenu()">Cerimônia</a>
          <a routerLink="/festa" routerLinkActive="active" (click)="closeMenu()">Festa</a>
          <a routerLink="/presentes" routerLinkActive="active" (click)="closeMenu()">Presentes</a>
          <a routerLink="/confirmar" routerLinkActive="active" (click)="closeMenu()">Confirmar Presença</a>
          <a routerLink="/spotify" routerLinkActive="active" (click)="closeMenu()">Spotify</a>
          <a routerLink="/fotos" routerLinkActive="active" (click)="closeMenu()">Fotos</a>
          <a routerLink="/wishlist" routerLinkActive="active" (click)="closeMenu()">Lista de Desejos</a>
        </nav>
      </div>
    </div>
    <div class="toolbar-spacer"></div>
  `
})
export class ToolbarComponent implements OnInit, OnDestroy {
  menuOpen = false;
  isMobile = false;
  private subscription: Subscription = new Subscription();

  constructor(private windowService: WindowService) {}

  ngOnInit() {
    this.subscription.add(
      this.windowService.screenSize$.subscribe(size => {
        this.isMobile = size.isMobile;
        if (!this.isMobile) {
          this.menuOpen = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    if (this.isMobile) {
      this.menuOpen = false;
    }
  }
}