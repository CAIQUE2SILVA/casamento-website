import { ConfirmarComponent } from './confirmar.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ConfirmarComponent', () => {
  let component: ConfirmarComponent;
  let fixture: ComponentFixture<ConfirmarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmarComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmarComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve expor o seletor correto', () => {
    expect(fixture.componentRef.componentType.name).toBe('ConfirmarComponent');
  });
});
