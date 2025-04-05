import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <h2 class="card-title mb-1">Área Administrativa</h2>
                <p class="text-muted">Faça login para acessar o painel</p>
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    formControlName="email"
                    class="form-control"
                    [ngClass]="{'is-invalid': submitted && emailControl.invalid}"
                    placeholder="Digite seu email">
                  <div *ngIf="submitted && emailControl.invalid" class="invalid-feedback">
                    <div *ngIf="emailControl.errors?.['required']">Email é obrigatório</div>
                    <div *ngIf="emailControl.errors?.['email']">Email inválido</div>
                  </div>
                </div>

                <div class="mb-4">
                  <label for="password" class="form-label">Senha</label>
                  <input
                    type="password"
                    id="password"
                    formControlName="password"
                    class="form-control"
                    [ngClass]="{'is-invalid': submitted && passwordControl.invalid}"
                    placeholder="Digite sua senha">
                  <div *ngIf="submitted && passwordControl.invalid" class="invalid-feedback">
                    <div *ngIf="passwordControl.errors?.['required']">Senha é obrigatória</div>
                  </div>
                </div>

                <div class="d-grid">
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg"
                    [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Entrar
                  </button>
                </div>
              </form>

              <div *ngIf="error" class="alert alert-danger mt-3">
                {{ error }}
              </div>
            </div>
          </div>

          <div class="text-center mt-4">
            <a routerLink="/" class="btn btn-outline-secondary">
              <i class="fas fa-arrow-left me-2"></i>Voltar para o site
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 1rem;
      border: none;
    }
    .card-title {
      font-weight: 700;
    }
    .btn-primary {
      background-color: #8B5CF6;
      border-color: #8B5CF6;
    }
    .btn-primary:hover, .btn-primary:focus {
      background-color: #7c4ff3;
      border-color: #7c4ff3;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AdminAuthService
  ) {
    console.log('LoginComponent inicializado');
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Preencher com os valores de teste para facilitar
    this.loginForm.setValue({
      email: 'admin@admin',
      password: 'caca12390'
    });
  }

  // Getters para facilitar acesso aos campos do formulário
  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    console.log('Tentando fazer login');

    // Verifica se o formulário é válido
    if (this.loginForm.invalid) {
      console.log('Formulário inválido');
      return;
    }

    this.loading = true;

    try {
      const email = this.emailControl.value;
      const password = this.passwordControl.value;

      console.log('Usando a senha mestra temporariamente');

      // Verificação simples da senha mestra sem depender do Firebase
      if (email === 'admin@admin' && password === 'caca12390') {
        console.log('Login bem-sucedido com senha mestra');
        localStorage.setItem('adminLoggedIn', 'true');
        this.router.navigate(['/admin/dashboard']);
      } else {
        console.log('Credenciais inválidas');
        this.error = 'Credenciais inválidas. Por favor, tente novamente.';
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      this.error = 'Ocorreu um erro ao fazer login. Por favor, tente novamente.';
    } finally {
      this.loading = false;
    }
  }
}