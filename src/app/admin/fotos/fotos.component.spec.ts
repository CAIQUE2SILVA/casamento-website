import { FotosComponent } from './fotos.component';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

describe('FotosComponent', () => {
  let component: FotosComponent;
  let fixture: ComponentFixture<FotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FotosComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(FotosComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve expor o seletor correto', () => {
    expect(fixture.componentRef.componentType.name).toBe('FotosComponent');
  });
});
