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
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isAdminRoute: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Detecta mudanças de rota
    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        // Verifica se a URL atual é uma rota de admin
        this.isAdminRoute =
          event.url.includes('/admin') || event.url.includes('/login');

        // Adiciona/remove classe do body baseada na rota
        this.updateBodyClass(event.url);
      });

    // Verificar a rota inicial
    const currentUrl = this.router.url;
    this.isAdminRoute =
      currentUrl.includes('/admin') || currentUrl.includes('/login');
    this.updateBodyClass(currentUrl);
  }

  private updateBodyClass(url: string) {
    const body = document.body;

    // Remove classes existentes
    body.classList.remove('home-page', 'admin-page');

    if (url === '/') {
      body.classList.add('home-page');
    } else if (url.includes('/admin') || url.includes('/login')) {
      body.classList.add('admin-page');
    }
  }
}
