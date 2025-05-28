import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-dark text-white py-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-6">
            <h4 class="h5 mb-3">Kimily & Kaua</h4>
            <p class="mb-0">19 de Novembro de 2025</p>
            <p class="mb-3">Celebrando nosso amor</p>
            <p>
              <a
                routerLink="/login"
                class="text-white-50 text-decoration-none small"
              >
                Área Administrativa
              </a>
            </p>
          </div>

          <div class="col-md-6">
            <h4 class="h5 mb-3">Links Rápidos</h4>
            <div class="d-flex flex-column">
              <a routerLink="/" class="text-white-50 text-decoration-none mb-2"
                >Início</a
              >
              <a
                routerLink="/sobre"
                class="text-white-50 text-decoration-none mb-2"
                >Sobre Nós</a
              >
              <a
                routerLink="/cerimonia"
                class="text-white-50 text-decoration-none mb-2"
                >Cerimônia</a
              >
              <!-- <a
                routerLink="/festa"
                class="text-white-50 text-decoration-none mb-2"
                >Festa</a
              > -->
              <!-- <a
                routerLink="/presentes"
                class="text-white-50 text-decoration-none mb-2"
                >Presentes</a
              > -->
              <a
                routerLink="/fotos"
                class="text-white-50 text-decoration-none mb-2"
                >Fotos</a
              >
            </div>
          </div>

          <!-- <div class="col-md-4">
            <h4 class="h5 mb-3">Contato</h4>
            <p class="mb-2">
              <i class="fas fa-envelope me-2"></i> kimilly.kaua@email.com
            </p>
            <p class="mb-2">
              <i class="fas fa-phone me-2"></i> (11) 98765-4321
            </p>
            <div class="mt-3">
              <a href="#" class="text-white me-3 fs-5"
                ><i class="fab fa-instagram"></i
              ></a>
              <a href="#" class="text-white me-3 fs-5"
                ><i class="fab fa-facebook"></i
              ></a>
              <a href="#" class="text-white fs-5"
                ><i class="fab fa-whatsapp"></i
              ></a>
            </div>
          </div> -->
        </div>

        <hr class="my-4" />

        <div class="text-center text-white-50 small">
          <p>&copy; 2025 Kimily & Kaua. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .bg-dark {
        background-color: #1a5276 !important;
      }

      h4 {
        color: #2e86c1;
        font-family: 'Playfair Display', cursive;
        font-weight: 600;
      }

      .text-white-50:hover {
        color: #2e86c1 !important;
        transition: color 0.3s ease;
      }

      @media (max-width: 768px) {
        .row {
          text-align: center;
        }

        .col-md-6:first-child {
          margin-bottom: 2rem;
        }
      }
    `,
  ],
})
export class FooterComponent {}
