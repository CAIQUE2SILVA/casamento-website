import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConvidadosService } from '../../services/convidados.service';

@Component({
  selector: 'app-confirmar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h1>Confirmar Presença</h1>

      <div class="content">
        <p class="intro-text">
          Estamos ansiosos para celebrar nosso casamento com você! Por favor, confirme sua presença preenchendo o formulário abaixo.
        </p>

        <div class="confirmation-card" *ngIf="!submitted">
          <form [formGroup]="confirmForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="nome">Nome Completo</label>
              <input type="text" id="nome" formControlName="nome" placeholder="Digite seu nome completo">
              <div class="error-message" *ngIf="nome?.invalid && (nome?.dirty || nome?.touched)">
                <span *ngIf="nome?.errors?.['required']">Nome é obrigatório</span>
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" formControlName="email" placeholder="Digite seu email">
              <div class="error-message" *ngIf="email?.invalid && (email?.dirty || email?.touched)">
                <span *ngIf="email?.errors?.['required']">Email é obrigatório</span>
                <span *ngIf="email?.errors?.['email']">Email inválido</span>
              </div>
            </div>

            <div class="form-group">
              <label for="telefone">Telefone</label>
              <input type="tel" id="telefone" formControlName="telefone" placeholder="(00) 00000-0000">
              <div class="error-message" *ngIf="telefone?.invalid && (telefone?.dirty || telefone?.touched)">
                <span *ngIf="telefone?.errors?.['required']">Telefone é obrigatório</span>
              </div>
            </div>

            <div class="form-group">
              <label for="acompanhantes">Número de Acompanhantes</label>
              <select id="acompanhantes" formControlName="acompanhantes">
                <option value="0">Nenhum acompanhante</option>
                <option value="1">1 acompanhante</option>
                <option value="2">2 acompanhantes</option>
                <option value="3">3 acompanhantes</option>
                <option value="4">4 acompanhantes</option>
              </select>
            </div>

            <div class="form-group">
              <label for="observacoes">Observações (opcional)</label>
              <textarea id="observacoes" formControlName="observacoes" rows="3" placeholder="Restrições alimentares, alergias, etc."></textarea>
            </div>

            <button type="submit" [disabled]="confirmForm.invalid || isSubmitting">
              <span *ngIf="!isSubmitting">Confirmar Presença</span>
              <span *ngIf="isSubmitting">Enviando...</span>
            </button>
          </form>
        </div>

        <div class="success-message" *ngIf="submitted">
          <div class="success-icon">✓</div>
          <h2>Presença Confirmada!</h2>
          <p>Obrigado por confirmar sua presença em nosso casamento. Estamos ansiosos para celebrar este momento especial com você!</p>
          <p>Um email de confirmação foi enviado para {{ confirmForm.get('email')?.value }}.</p>
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

    h1 {
      text-align: center;
      margin-bottom: 2rem;
    }

    .content {
      line-height: 1.6;
    }

    .intro-text {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }

    .confirmation-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    input, select, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: #1a5276;
        box-shadow: 0 0 0 2px rgba(26, 82, 118, 0.2);
      }
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }

    button {
      display: block;
      width: 100%;
      padding: 0.75rem;
      background-color: #1a5276;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #154360;
      }

      &:disabled {
        background-color: #95a5a6;
        cursor: not-allowed;
      }
    }

    .success-message {
      text-align: center;
      padding: 3rem 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .success-icon {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      height: 80px;
      background-color: #2ecc71;
      color: white;
      font-size: 2.5rem;
      border-radius: 50%;
      margin-bottom: 1.5rem;
    }

    h2 {
      color: #2ecc71;
      margin-bottom: 1.5rem;
    }
  `]
})
export class ConfirmarComponent {
  confirmForm: FormGroup;
  isSubmitting = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private convidadosService: ConvidadosService
  ) {
    this.confirmForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      acompanhantes: ['0'],
      observacoes: ['']
    });
  }

  get nome() { return this.confirmForm.get('nome'); }
  get email() { return this.confirmForm.get('email'); }
  get telefone() { return this.confirmForm.get('telefone'); }

  async onSubmit() {
    if (this.confirmForm.invalid) return;

    this.isSubmitting = true;

    try {
      await this.convidadosService.confirmarPresencaPublica(
        this.nome?.value,
        this.email?.value,
        this.telefone?.value,
        parseInt(this.confirmForm.get('acompanhantes')?.value || '0', 10),
        this.confirmForm.get('observacoes')?.value || ''
      );

      this.submitted = true;
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      alert('Ocorreu um erro ao confirmar sua presença. Por favor, tente novamente.');
    } finally {
      this.isSubmitting = false;
    }
  }
}