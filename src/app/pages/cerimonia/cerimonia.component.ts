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
            <p>15 de Novembro de 2025</p>
            <p class="detail-info">Sábado</p>
          </div>

          <div class="detail-card">
            <div class="icon">⏰</div>
            <h3>Horário</h3>
            <p>19:00</p>
            <p class="detail-info">
              Pedimos que cheguem com 30 minutos de antecedência
            </p>
          </div>

          <div class="detail-card">
            <div class="icon">🏛️</div>
            <h3>Local</h3>
            <p>Praça Comandante Eduardo de Oliveira 96 Parque Edu Chaves</p>
          </div>
        </div>

        <div class="map-section">
          <h2>Como Chegar</h2>
          <div class="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.5203745558883!2d-46.56486479040401!3d-23.47775910690703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cef5b97e08fb15%3A0xf70c95a2013ec9b7!2sBuffet%20DF!5e0!3m2!1sen!2sbr!4v1748448557226!5m2!1sen!2sbr"
              width="100%"
              height="450"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div class="info-section">
          <h2>Informações Importantes</h2>

          <div class="info-cards">
            <div class="info-card">
              <h3>Traje</h3>
              <p>Traje Esporte Fino</p>
              <p class="info-detail">Homens: Camisa social da sua preferência</p>
              <p class="info-detail">Mulheres: Vestido longo ou midi</p>
            </div>

            <div class="info-card">
              <h3>Fotos</h3>
              <p>Teremos fotógrafos profissionais</p>
              <p class="info-detail">
                Sinta-se à vontade para tirar fotos durante a cerimônia, mas
                pedimos que evite o uso de flash
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 900px;
        margin: 2rem auto 3rem;
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
    `,
  ],
})
export class CerimoniaComponent {}
