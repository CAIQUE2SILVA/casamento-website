import { ConvidadosComponent } from './convidados.component';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('ConvidadosComponent', () => {
  let component: ConvidadosComponent;
  let fixture: ComponentFixture<ConvidadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvidadosComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ConvidadosComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve expor o seletor correto', () => {
    expect(fixture.componentRef.componentType.name).toBe('ConvidadosComponent');
  });
});
