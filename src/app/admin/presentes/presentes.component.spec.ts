import { PresentesComponent } from './presentes.component';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

describe('PresentesComponent', () => {
  let component: PresentesComponent;
  let fixture: ComponentFixture<PresentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresentesComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(PresentesComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve expor o seletor correto', () => {
    expect(fixture.componentRef.componentType.name).toBe('PresentesComponent');
  });
});
