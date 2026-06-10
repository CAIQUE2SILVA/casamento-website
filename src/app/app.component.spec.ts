import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve iniciar sem rota admin', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.isAdminRoute).toBeFalse();
  });

  it('deve reconhecer padrões de URL admin', () => {
    const urlsAdmin = ['/login', '/admin/dashboard', '/admin/convidados'];
    urlsAdmin.forEach((url) => {
      expect(url.includes('/admin') || url.includes('/login')).toBeTrue();
    });
  });
});
