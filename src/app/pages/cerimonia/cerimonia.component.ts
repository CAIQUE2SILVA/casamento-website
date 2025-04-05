import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cerimonia',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Cerimônia</h1>

      <div class="content">
        <div class="ceremony-details">
          <div class="detail-card">
            <div class="icon">📅</div>
            <h3>Data</h3>
            <p>02 de Fevereiro de 2023</p>
            <p class="detail-info">Quinta-feira</p>
          </div>

          <div class="detail-card">
            <div class="icon">⏰</div>
            <h3>Horário</h3>
            <p>16:00</p>
            <p class="detail-info">Pedimos que cheguem com 30 minutos de antecedência</p>
          </div>

          <div class="detail-card">
            <div class="icon">🏛️</div>
            <h3>Local</h3>
            <p>Igreja Nossa Senhora da Paz</p>
            <p class="detail-info">Rua das Flores, 123 - Centro</p>
          </div>
        </div>

        <div class="map-section">
          <h2>Como Chegar</h2>
          <div class="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.3564349262354!2d-43.18105908503451!3d-22.90692998501355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997f5fd24e0bbb%3A0x99447fc2d5c7032d!2sRio%20de%20Janeiro%2C%20RJ!5e0!3m2!1spt-BR!2sbr!4v1623869115267!5m2!1spt-BR!2sbr"
              width="100%"
              height="450"
              style="border:0;"
              allowfullscreen=""
              loading="lazy">
            </iframe>
          </div>
        </div>

        <div class="info-section">
          <h2>Informações Importantes</h2>

          <div class="info-cards">
            <div class="info-card">
              <h3>Traje</h3>
              <p>Traje Social Completo</p>
              <p class="info-detail">Homens: Terno escuro</p>
              <p class="info-detail">Mulheres: Vestido longo ou midi</p>
            </div>

            <div class="info-card">
              <h3>Estacionamento</h3>
              <p>Estacionamento disponível no local</p>
              <p class="info-detail">Valor: R$ 30,00</p>
            </div>

            <div class="info-card">
              <h3>Fotos</h3>
              <p>Teremos fotógrafos profissionais</p>
              <p class="info-detail">Sinta-se à vontade para tirar fotos durante a cerimônia, mas pedimos que evite o uso de flash</p>
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
      text-align: center;
      margin: 3rem 0 2rem;
      font-family: 'Times New Roman', serif;
      color: #1a5276;
    }

    .content {
      line-height: 1.6;
    }

    .ceremony-details {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 2rem;
      margin-top: 2rem;
    }

    .detail-card {
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      flex: 1;
      min-width: 200px;
      max-width: 300px;

      .icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        color: #1a5276;
      }

      p {
        margin: 0;
        font-weight: bold;
        font-size: 1.1rem;
      }

      .detail-info {
        margin-top: 0.5rem;
        font-weight: normal;
        font-size: 0.9rem;
        color: #666;
      }
    }

    .map-container {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .info-cards {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 2rem;
    }

    .info-card {
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      flex: 1;
      min-width: 250px;

      h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        color: #1a5276;
        text-align: center;
      }

      p {
        margin: 0;
        text-align: center;
        font-weight: bold;
      }

      .info-detail {
        margin-top: 0.5rem;
        font-weight: normal;
        font-size: 0.9rem;
        color: #666;
      }
    }

    @media (max-width: 768px) {
      .ceremony-details {
        flex-direction: column;
        align-items: center;
      }

      .detail-card {
        width: 100%;
        max-width: 100%;
      }
    }
  `]
})
export class CerimoniaComponent {}