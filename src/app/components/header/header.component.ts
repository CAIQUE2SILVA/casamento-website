import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
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
