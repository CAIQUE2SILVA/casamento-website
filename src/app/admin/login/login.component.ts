import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Verificar se já está logado
    if (this.isLoggedIn()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  // Getters para facilitar acesso aos campos do formulário
  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  private isLoggedIn(): boolean {
    return localStorage.getItem('adminLoggedIn') === 'true';
  }

  async onSubmit() {
    this.submitted = true;
    this.error = '';

    // Verifica se o formulário é válido
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    try {
      // Simular um pequeno delay para melhor UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      const email = this.emailControl.value;
      const password = this.passwordControl.value;

      // Verificação simples da senha mestra
      if (email === 'admin@admin' && password === 'caca12390') {
        localStorage.setItem('adminLoggedIn', 'true');

        // Usar setTimeout para evitar problemas de navegação
        setTimeout(() => {
          this.router.navigate(['/admin/dashboard']);
        }, 100);
      } else {
        this.error = 'Credenciais inválidas. Por favor, tente novamente.';
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      this.error =
        'Ocorreu um erro ao fazer login. Por favor, tente novamente.';
    } finally {
      this.loading = false;
    }
  }
}
