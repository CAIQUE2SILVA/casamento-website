import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'presentes', loadComponent: () => import('./presentes/presentes.component').then(m => m.PresentesComponent) },
      { path: 'fotos', loadComponent: () => import('./fotos/fotos.component').then(m => m.FotosComponent) },
      { path: 'convidados', loadComponent: () => import('./convidados/convidados.component').then(m => m.ConvidadosComponent) }
    ]
  }
];