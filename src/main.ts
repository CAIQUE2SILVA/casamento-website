import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

console.log('Iniciando aplicação...');

bootstrapApplication(AppComponent, appConfig)
  .then(() => console.log('Aplicação inicializada com sucesso!'))
  .catch((err) => console.error('Erro ao inicializar aplicação:', err));
