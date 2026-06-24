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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  totalFotos = 0;
  totalPresentes = 0;
  presentesReservados = 0;
  loading = true;

  constructor(
    private presentesService: PresentesService,
    private fotosService: FotosService,
    private router: Router
  ) {}

  ngOnInit() {
    // Carregar estatísticas com delay para evitar problemas
    setTimeout(() => {
      this.loadStats();
    }, 100);
  }

  async loadStats() {
    this.loading = true;

    try {
      // Carregar presentes com timeout
      const presentesPromise = Promise.race([
        firstValueFrom(this.presentesService.getPresentes()),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 5000)
        ),
      ]);

      const presentes = (await presentesPromise) as Presente[];
      this.totalPresentes = presentes?.length || 0;
      this.presentesReservados =
        presentes?.filter((p) => p.reservado).length || 0;
    } catch (error) {
      console.error('Erro ao carregar presentes:', error);
      this.totalPresentes = 0;
      this.presentesReservados = 0;
    }

    try {
      // Carregar fotos com timeout
      const fotosPromise = Promise.race([
        this.fotosService.getFotos(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 5000)
        ),
      ]);

      const fotos = (await fotosPromise) as Foto[];
      this.totalFotos = fotos?.length || 0;
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
      this.totalFotos = 0;
    }

    this.loading = false;
  }

  logout() {
    localStorage.removeItem('adminLoggedIn');

    // Usar setTimeout para evitar problemas de navegação
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 100);
  }
}
