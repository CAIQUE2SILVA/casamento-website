import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
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