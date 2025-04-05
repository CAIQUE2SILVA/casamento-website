import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Interface para simular um usuário
interface AdminUser {
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private adminUser = 'admin@admin';
  private adminPassword = 'caca12390';

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<AdminUser | null>(null);

  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Verificar se há um estado de login salvo no localStorage
    const savedLogin = localStorage.getItem('adminLoggedIn');
    if (savedLogin === 'true') {
      this.isLoggedInSubject.next(true);
      this.currentUserSubject.next({
        email: this.adminUser,
        name: 'Administrador'
      });
    }
  }

  async login(email: string, password: string): Promise<void> {
    // Simular um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email === this.adminUser && password === this.adminPassword) {
      // Login bem-sucedido
      this.isLoggedInSubject.next(true);
      this.currentUserSubject.next({
        email: email,
        name: 'Administrador'
      });

      // Salvar estado no localStorage
      localStorage.setItem('adminLoggedIn', 'true');
    } else {
      throw new Error('Credenciais inválidas');
    }
  }

  async logout(): Promise<void> {
    // Simular um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));

    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next(null);

    // Remover estado do localStorage
    localStorage.removeItem('adminLoggedIn');
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }
}
