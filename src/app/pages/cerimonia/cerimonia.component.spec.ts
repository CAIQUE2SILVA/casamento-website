import { CerimoniaComponent } from './cerimonia.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

describe('CerimoniaComponent', () => {
  let component: CerimoniaComponent;
  let fixture: ComponentFixture<CerimoniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CerimoniaComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(CerimoniaComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve expor o seletor correto', () => {
    expect(fixture.componentRef.componentType.name).toBe('CerimoniaComponent');
  });
});
