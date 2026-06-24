import { ConviteComponent } from './convite.component';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ConviteComponent', () => {
  let component: ConviteComponent;
  let fixture: ComponentFixture<ConviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConviteComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ConviteComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve expor o seletor correto', () => {
    expect(fixture.componentRef.componentType.name).toBe('ConviteComponent');
  });
});
