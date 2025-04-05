import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Sobre Nós</h1>

      <div class="content">
        <div class="couple-photo">
          <img src="/assets/hero.jpg" alt="Gabriela e Henrique">
        </div>

        <div class="story">
          <h2>Nossa História</h2>
          <p>
            Tudo começou em uma tarde de verão em 2018, quando nos conhecemos através de amigos em comum em um churrasco.
            O que parecia ser apenas um encontro casual se transformou no início de uma linda história de amor.
          </p>

          <p>
            Após alguns meses de amizade, começamos a namorar e descobrimos que tínhamos muito mais em comum do que imaginávamos.
            Compartilhamos os mesmos valores, sonhos e uma paixão por viajar e conhecer novos lugares.
          </p>

          <h2>O Pedido</h2>
          <p>
            Em dezembro de 2021, durante uma viagem para a praia, Henrique preparou uma surpresa especial.
            Ao pôr do sol, em uma caminhada pela areia, ele se ajoelhou e fez o pedido que mudaria nossas vidas para sempre.
            Com o mar como testemunha, dissemos "sim" para construir uma vida juntos.
          </p>

          <h2>O Casamento</h2>
          <p>
            Agora, estamos prestes a dar o próximo passo em nossa jornada. No dia 02 de fevereiro de 2023,
            celebraremos nosso amor rodeados por familiares e amigos queridos. Será um dia inesquecível,
            e ficaríamos muito felizes em compartilhar esse momento especial com você.
          </p>
        </div>

        <div class="timeline">
          <h2>Nossa Linha do Tempo</h2>

          <div class="timeline-item">
            <div class="timeline-date">Junho 2018</div>
            <div class="timeline-content">
              <h3>Primeiro Encontro</h3>
              <p>Nos conhecemos em um churrasco de amigos em comum.</p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-date">Setembro 2018</div>
            <div class="timeline-content">
              <h3>Início do Namoro</h3>
              <p>Oficialmente começamos a namorar após três meses de amizade.</p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-date">Março 2020</div>
            <div class="timeline-content">
              <h3>Mudança</h3>
              <p>Decidimos morar juntos e começar nossa vida a dois.</p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-date">Dezembro 2021</div>
            <div class="timeline-content">
              <h3>O Pedido</h3>
              <p>Henrique pediu Gabriela em casamento durante uma viagem à praia.</p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-date">Fevereiro 2023</div>
            <div class="timeline-content">
              <h3>O Grande Dia</h3>
              <p>Celebraremos nosso casamento rodeados por pessoas queridas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 900px;
      margin: 80px auto 3rem;
      padding: 0 1rem;
    }

    h1 {
      text-align: center;
      margin-bottom: 2rem;
      font-family: 'Times New Roman', serif;
      font-size: 2.5rem;
      letter-spacing: 2px;
    }

    h2 {
      font-family: 'Times New Roman', serif;
      color: #1a5276;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }

    .content {
      line-height: 1.8;
    }

    .couple-photo {
      text-align: center;
      margin-bottom: 2rem;

      img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }
    }

    .story {
      margin-bottom: 3rem;

      p {
        margin-bottom: 1.5rem;
        color: #333;
      }
    }

    .timeline {
      position: relative;
      padding-left: 2rem;
      margin-top: 4rem;

      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 2px;
        background-color: #1a5276;
      }
    }

    .timeline-item {
      position: relative;
      margin-bottom: 2.5rem;

      &:before {
        content: '';
        position: absolute;
        left: -2.5rem;
        top: 0.5rem;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        background-color: #1a5276;
      }
    }

    .timeline-date {
      font-weight: bold;
      color: #1a5276;
      margin-bottom: 0.5rem;
    }

    .timeline-content {
      h3 {
        margin-top: 0;
        margin-bottom: 0.5rem;
        color: #333;
      }

      p {
        margin: 0;
        color: #666;
      }
    }

    @media (max-width: 768px) {
      .timeline {
        padding-left: 1.5rem;
      }

      .timeline-item:before {
        left: -2rem;
      }
    }
  `]
})
export class SobreComponent {}