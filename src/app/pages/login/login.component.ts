import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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