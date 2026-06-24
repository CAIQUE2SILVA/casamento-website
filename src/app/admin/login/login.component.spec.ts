import { LoginComponent } from './login.component';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve invalidar o formulário quando vazio', () => {
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('deve validar credenciais admin', () => {
    component.loginForm.setValue({ email: 'admin@admin', password: 'caca12390' });
    expect(component.loginForm.valid).toBeTrue();
  });
});
