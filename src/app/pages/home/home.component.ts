import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero d-flex align-items-center justify-content-center text-center text-white">
        <div class="container">
        <h1 class="wedding-couple">
  <span class="cursive">Kauã</span>
  <span>&</span>
  <span class="cursive">Kimilly</span>
  <svg class="heart-svg" viewBox="0 0 32 29.6">
    <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
        C22.5,20.3,32,17.8,32,8.4C32,3.8,28.2,0,23.6,0z"/>
  </svg>
</h1>
          <p class="fs-4 mb-5">02 DE NOVEMBRO DE 2025</p>

          <div class="row justify-content-center countdown-container">
            <div class="col-3 col-md-2">
              <div class="countdown-item">
                <span class="count-number cursive">{{ countdown.days }}</span>
                <span class="label">Dias</span>
              </div>
            </div>
            <div class="col-3 col-md-2">
              <div class="countdown-item">
                <span class="count-number cursive">{{ countdown.hours }}</span>
                <span class="label">Horas</span>
              </div>
            </div>
            <div class="col-3 col-md-2">
              <div class="countdown-item">
                <span class="count-number cursive">{{ countdown.minutes }}</span>
                <span class="label">Min</span>
              </div>
            </div>
            <div class="col-3 col-md-2">
              <div class="countdown-item">
                <span class="count-number cursive">{{ countdown.seconds }}</span>
                <span class="label">Seg</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Welcome Section -->
      <section class="py-5">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8 text-center">
              <h2 class="display-5 mb-4">Bem-vindos ao nosso site de casamento!</h2>
              <p class="lead mb-5">
                Estamos muito felizes em compartilhar este momento especial com vocês.
                Aqui você encontrará todas as informações sobre nosso grande dia.
              </p>
            </div>
          </div>

          <div class="row g-4">
            <div class="col-md-6 col-lg-3">
              <a routerLink="/cerimonia" class="card h-100 text-decoration-none card-hover">
                <div class="card-body text-center py-4">
                  <div class="card-icon mb-3">
                    <i class="fas fa-church fa-3x text-primary"></i>
                  </div>
                  <h3 class="card-title h5">Cerimônia</h3>
                  <p class="card-text text-muted">Detalhes sobre a cerimônia religiosa</p>
                </div>
              </a>
            </div>

            <div class="col-md-6 col-lg-3">
              <a routerLink="/festa" class="card h-100 text-decoration-none card-hover">
                <div class="card-body text-center py-4">
                  <div class="card-icon mb-3">
                    <i class="fas fa-glass-cheers fa-3x text-primary"></i>
                  </div>
                  <h3 class="card-title h5">Festa</h3>
                  <p class="card-text text-muted">Informações sobre a recepção</p>
                </div>
              </a>
            </div>

            <div class="col-md-6 col-lg-3">
              <a routerLink="/presentes" class="card h-100 text-decoration-none card-hover">
                <div class="card-body text-center py-4">
                  <div class="card-icon mb-3">
                    <i class="fas fa-gift fa-3x text-primary"></i>
                  </div>
                  <h3 class="card-title h5">Presentes</h3>
                  <p class="card-text text-muted">Nossa lista de presentes</p>
                </div>
              </a>
            </div>

            <div class="col-md-6 col-lg-3">
              <a routerLink="/confirmar" class="card h-100 text-decoration-none card-hover">
                <div class="card-body text-center py-4">
                  <div class="card-icon mb-3">
                    <i class="fas fa-calendar-check fa-3x text-primary"></i>
                  </div>
                  <h3 class="card-title h5">Confirmar Presença</h3>
                  <p class="card-text text-muted">Confirme sua presença aqui</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      padding-top: 0;
    }

    .hero {
      height: 100vh;
      background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/assets/hero.jpg');
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .countdown-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .countdown-item {
      background-color: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(5px);
      padding: 1rem;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
    }

    .count {
      font-size: 2rem;
      font-weight: 700;
    }

    .label {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .text-primary {
      color: #8B5CF6 !important;
    }

    .card-hover {
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .card-hover:hover {
      transform: translateY(-10px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }

    .card-icon {
      color: #8B5CF6;
    }

    @media (max-width: 576px) {
      .count {
        font-size: 1.5rem;
      }

      .label {
        font-size: 0.7rem;
      }
    }

    .wedding-couple {
      margin-bottom: 1.5rem;
      margin-top: 1.5rem;
      font-size: 3.5rem !important;
    }

    .wedding-couple .cursive {
      font-family: 'Playfair Display', cursive;
      font-style: italic;
      color: #8B5CF6;
      font-size: 3.8rem !important;
    }

    .heart-svg {
      width: 35px;
      height: 35px;
      fill: #8B5CF6;
      margin-left: 15px;
      vertical-align: middle;
      animation: heartbeat 1.5s ease-in-out infinite;
    }

    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      15% { transform: scale(1.2); }
      30% { transform: scale(1); }
      45% { transform: scale(1.3); }
      60% { transform: scale(1); }
    }

    .count-number {
      font-size: 3.2rem !important;
      font-family: 'Playfair Display', cursive;
      font-style: italic;
      font-weight: bold;
    }

    .countdown-box {
      padding: 1rem 1.5rem !important;
    }
  `]
})
export class HomeComponent implements OnInit {
  countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  private timer: any;
  private weddingDate = new Date('2025-11-02T16:00:00');

  ngOnInit() {
    this.updateCountdown();
    this.timer = setInterval(() => this.updateCountdown(), 1000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private updateCountdown() {
    const now = new Date();
    const diff = this.weddingDate.getTime() - now.getTime();

    if (diff <= 0) {
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      clearInterval(this.timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    this.countdown = { days, hours, minutes, seconds };
  }
}

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Sobre Nós</h1>
      <div class="content">
        <p>Nossa história começou...</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 80px auto 2rem;
      padding: 0 1rem;
    }

    h1 {
      text-align: center;
      margin-bottom: 2rem;
    }

    .content {
      line-height: 1.6;
    }
  `]
})
export class SobreComponent {}