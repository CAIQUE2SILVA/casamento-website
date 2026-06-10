import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentesService } from '../../services/presentes.service';
import { firstValueFrom } from 'rxjs';

interface Presente {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  imagem?: string;
  disponivel: boolean;
  reservadoPor?: string;
  link?: string;
}

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  presentes: Presente[] = [];
  loading = true;
  selectedPresente: Presente | null = null;
  reservationName = '';

  constructor(private presentesService: PresentesService) {}

  ngOnInit() {
    this.loadPresentes();
  }

  async loadPresentes() {
    this.loading = true;
    try {
      const presentes = await firstValueFrom(
        this.presentesService.getPresentes()
      );
      this.presentes = presentes.map((p) => ({
        id: p.id,
        nome: p.nome,
        descricao: p.descricao,
        preco: p.preco,
        imagem: 'assets/images/gift-placeholder.jpg', // Imagem padrão
        disponivel: !p.reservado,
        reservadoPor: p.reservadoPor || '',
      }));
    } catch (error) {
      console.error('Erro ao carregar presentes:', error);
    } finally {
      this.loading = false;
    }
  }

  openReserveModal(presente: any) {
    this.selectedPresente = presente;
    this.reservationName = '';
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.selectedPresente = null;
    document.body.style.overflow = 'auto';
  }

  async reservePresente() {
    if (
      !this.selectedPresente ||
      !this.selectedPresente.id ||
      !this.reservationName
    )
      return;

    try {
      await firstValueFrom(
        this.presentesService.reservarPresente(
          this.selectedPresente.id,
          this.reservationName
        )
      );
      this.closeModal();

      // Atualizar o item na lista local
      const index = this.presentes.findIndex(
        (p) => p.id === this.selectedPresente?.id
      );
      if (index !== -1) {
        this.presentes[index] = {
          ...this.presentes[index],
          disponivel: false,
          reservadoPor: this.reservationName,
        };
      }
    } catch (error) {
      console.error('Erro ao reservar presente:', error);
    }
  }
}
