import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Login Administrativo</h2>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              placeholder="Digite seu email"
            >
            <div class="error-message" *ngIf="email?.invalid && (email?.dirty || email?.touched)">
              <span *ngIf="email?.errors?.['required']">Email é obrigatório</span>
              <span *ngIf="email?.errors?.['email']">Email inválido</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Senha</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              placeholder="Digite sua senha"
            >
            <div class="error-message" *ngIf="password?.invalid && (password?.dirty || password?.touched)">
              <span *ngIf="password?.errors?.['required']">Senha é obrigatória</span>
            </div>
          </div>

          <div class="error-message login-error" *ngIf="loginError">
            {{ loginError }}
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading">
            <span *ngIf="!isLoading">Entrar</span>
            <span *ngIf="isLoading">Entrando...</span>
          </button>
        </form>

        <div class="back-link">
          <a routerLink="/">Voltar para o site</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 1rem;
    }

    .login-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      width: 100%;
      max-width: 400px;
    }

    h2 {
      text-align: center;
      margin-top: 0;
      margin-bottom: 2rem;
      color: #1a5276;
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

    input {
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

    .login-error {
      margin-bottom: 1rem;
      text-align: center;
    }

    button {
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

    .back-link {
      text-align: center;
      margin-top: 1.5rem;

      a {
        color: #1a5276;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.loginError = '';

    try {
      await this.authService.login(
        this.email?.value,
        this.password?.value
      );

      this.router.navigate(['/admin']);
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);

      // Mensagens de erro amigáveis
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        this.loginError = 'Email ou senha incorretos';
      } else if (error.code === 'auth/too-many-requests') {
        this.loginError = 'Muitas tentativas de login. Tente novamente mais tarde';
      } else {
        this.loginError = 'Erro ao fazer login. Tente novamente';
      }
    } finally {
      this.isLoading = false;
    }
  }
}