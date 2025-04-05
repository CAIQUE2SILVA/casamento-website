import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentesService, Presente } from '../../services/presentes.service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-presentes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './presentes.component.html',
  styleUrls: ['./presentes.component.scss']
})
export class PresentesComponent implements OnInit {
  presentes: Presente[] = [];
  loading = false;
  error = '';
  nomeConvidado = '';

  constructor(private presentesService: PresentesService) {}

  ngOnInit(): void {
    this.loadPresentes();
  }

  async loadPresentes(): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      this.presentes = await firstValueFrom(this.presentesService.getPresentes());
    } catch (err) {
      this.error = 'Erro ao carregar a lista de presentes. Por favor, tente novamente mais tarde.';
      console.error('Erro ao carregar presentes:', err);
    } finally {
      this.loading = false;
    }
  }

  async reservarPresente(id: string): Promise<void> {
    if (!this.nomeConvidado.trim()) {
      this.error = 'Por favor, informe seu nome para reservar o presente.';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      await firstValueFrom(this.presentesService.reservarPresente(id, this.nomeConvidado));
      await this.loadPresentes();
      this.nomeConvidado = '';
    } catch (err: any) {
      this.error = err.message || 'Erro ao reservar o presente. Por favor, tente novamente mais tarde.';
      console.error('Erro ao reservar presente:', err);
    } finally {
      this.loading = false;
    }
  }
}
