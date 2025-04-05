import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private router: Router) {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    this.isLoggedInSubject.next(isLoggedIn);
  }

  login(email: string, password: string): boolean {
    // Verificar se é a senha mestra para admin
    if (email === 'admin@admin' && password === 'caca12390') {
      localStorage.setItem('adminLoggedIn', 'true');
      this.isLoggedInSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('adminLoggedIn');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }
}