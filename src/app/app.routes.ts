import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './admin/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ConvidadosComponent } from './admin/convidados/convidados.component';
import { PresentesComponent } from './components/presentes/presentes.component';
import { FotosComponent } from './admin/fotos/fotos.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'sobre',
    loadComponent: () =>
      import('./pages/sobre/sobre.component').then((m) => m.SobreComponent),
  },
  {
    path: 'cerimonia',
    loadComponent: () =>
      import('./pages/cerimonia/cerimonia.component').then(
        (m) => m.CerimoniaComponent
      ),
  },
  // {
  //   path: 'festa',
  //   loadComponent: () =>
  //     import('./pages/festa/festa.component').then((m) => m.FestaComponent),
  // },
  // {
  //   path: 'presentes',
  //   component: PresentesComponent,
  // },
  {
    path: 'fotos',
    loadComponent: () =>
      import('./pages/fotos/fotos.component').then((m) => m.FotosComponent),
  },
  // {
  //   path: 'confirmacao',
  //   loadComponent: () =>
  //     import('./pages/confirmacao/confirmacao.component').then(
  //       (m) => m.ConfirmacaoComponent
  //     ),
  // },
  // Nova rota para convite
  {
    path: 'convite/:token',
    loadComponent: () =>
      import('./pages/convite/convite.component').then(
        (m) => m.ConviteComponent
      ),
  },
  // Rota para convite sem token (para teste)
  {
    path: 'convite',
    loadComponent: () =>
      import('./pages/convite/convite.component').then(
        (m) => m.ConviteComponent
      ),
  },
  // Rotas de admin simplificadas
  { path: 'login', component: LoginComponent },
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/convidados',
    component: ConvidadosComponent,
    canActivate: [authGuard],
  },
  // {
  //   path: 'admin/presentes',
  //   loadComponent: () =>
  //     import('./admin/presentes/presentes.component').then(
  //       (m) => m.PresentesComponent
  //     ),
  //   canActivate: [authGuard],
  // },
  // {
  //   path: 'admin/fotos',
  //   component: FotosComponent,
  //   canActivate: [authGuard],
  // },
  { path: 'admin', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
