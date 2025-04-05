import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-presentes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Lista de Presentes</h1>
      <div class="content">
        <p>Nossa lista de presentes...</p>
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
export class PresentesComponent {}