import { FestaComponent } from './festa.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

describe('FestaComponent', () => {
  let component: FestaComponent;
  let fixture: ComponentFixture<FestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FestaComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(FestaComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve expor o seletor correto', () => {
    expect(fixture.componentRef.componentType.name).toBe('FestaComponent');
  });
});
