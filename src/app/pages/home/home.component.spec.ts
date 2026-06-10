import { HomeComponent } from './home.component';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar a contagem regressiva', () => {
    component.ngOnInit();
    expect(component.countdown).toEqual(
      jasmine.objectContaining({
        days: jasmine.any(Number),
        hours: jasmine.any(Number),
        minutes: jasmine.any(Number),
        seconds: jasmine.any(Number),
      })
    );
  });

  afterEach(() => {
    component.ngOnDestroy();
  });
});
