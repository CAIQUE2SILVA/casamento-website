import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FotosService } from '../../services/fotos.service';

interface Foto {
  id: string;
  titulo: string;
  descricao?: string;
  url: string;
}

@Component({
  selector: 'app-fotos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fotos.component.html',
  styleUrls: ['./fotos.component.scss'],
})
export class FotosComponent implements OnInit {
  fotos: Foto[] = [];
  loading = true;
  selectedFoto: Foto | null = null;

  constructor(private fotosService: FotosService) {}

  ngOnInit() {
    this.loadFotos();
  }

  async loadFotos() {
    this.loading = true;
    try {
      this.fotos = await this.fotosService.getFotos();
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
    } finally {
      this.loading = false;
    }
  }

  openModal(foto: Foto) {
    this.selectedFoto = foto;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.selectedFoto = null;
    document.body.style.overflow = 'auto';
  }
}
