import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spotify',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Playlist do Casamento</h1>
      <div class="content">
        <p>Ajude-nos a criar a playlist perfeita para o nosso casamento!</p>

        <div class="spotify-embed">
          <iframe
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M"
            width="100%"
            height="380"
            frameborder="0"
            allowtransparency="true"
            allow="encrypted-media">
          </iframe>
        </div>

        <div class="suggestion-box">
          <h2>Sugira uma música</h2>
          <p>Envie sua sugestão para nossa playlist!</p>

          <form>
            <div class="form-group">
              <label for="nome">Seu Nome</label>
              <input type="text" id="nome" placeholder="Digite seu nome">
            </div>

            <div class="form-group">
              <label for="musica">Nome da Música</label>
              <input type="text" id="musica" placeholder="Digite o nome da música">
            </div>

            <div class="form-group">
              <label for="artista">Artista</label>
              <input type="text" id="artista" placeholder="Digite o nome do artista">
            </div>

            <button type="submit">Enviar Sugestão</button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 80px auto 2rem;
      padding: 0 1rem;
    }

    h1, h2 {
      text-align: center;
    }

    h1 {
      margin-bottom: 2rem;
    }

    h2 {
      margin-top: 3rem;
      margin-bottom: 1rem;
    }

    .content {
      line-height: 1.6;
    }

    .spotify-embed {
      margin: 2rem 0;
      border-radius: 8px;
      overflow: hidden;
    }

    .suggestion-box {
      background-color: #f9f9f9;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    button {
      display: block;
      width: 100%;
      padding: 0.75rem;
      background-color: #1DB954;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #1AA34A;
      }
    }
  `]
})
export class SpotifyComponent {}