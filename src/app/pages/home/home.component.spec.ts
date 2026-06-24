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

  afterEach(() => {
    component.ngOnDestroy();
    jasmine.clock().uninstall();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar a contagem regressiva quando a data do casamento ainda não passou', () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2025-11-01T12:00:00'));

    component.ngOnInit();

    expect(component.casados).toBeFalse();
    expect(component.countdown).toEqual(
      jasmine.objectContaining({
        days: jasmine.any(Number),
        hours: jasmine.any(Number),
        minutes: jasmine.any(Number),
        seconds: jasmine.any(Number),
      })
    );
  });

  it('deve marcar casados quando a data atual é posterior ao casamento', () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2026-06-09T12:00:00'));

    component.ngOnInit();

    expect(component.casados).toBeTrue();
  });

  it('deve exibir Casados no template quando casados for true', () => {
    component.casados = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.married-message')?.textContent).toContain(
      'Casados'
    );
    expect(compiled.querySelector('.countdown-container')).toBeNull();
  });
});
