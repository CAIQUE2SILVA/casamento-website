import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, Event } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <!-- Mostrar header somente em páginas que não são do admin -->
    <app-header *ngIf="!isAdminRoute"></app-header>

    <main [ngClass]="{'admin-page': isAdminRoute}">
      <router-outlet></router-outlet>
    </main>

    <!-- Mostrar footer somente em páginas que não são do admin -->
    <app-footer *ngIf="!isAdminRoute"></app-footer>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    main {
      flex: 1;
    }

    .admin-page {
      padding-top: 0;
    }
  `]
})
export class AppComponent implements OnInit {
  isAdminRoute: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Detecta mudanças de rota
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Verifica se a URL atual é uma rota de admin
      this.isAdminRoute = event.url.includes('/admin') || event.url.includes('/login');
    });

    // Verificar a rota inicial
    const currentUrl = this.router.url;
    this.isAdminRoute = currentUrl.includes('/admin') || currentUrl.includes('/login');
  }
}
