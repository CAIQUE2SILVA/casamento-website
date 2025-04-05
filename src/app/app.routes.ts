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
    loadComponent: () => import('./pages/sobre/sobre.component').then(m => m.SobreComponent)
  },
  {
    path: 'cerimonia',
    loadComponent: () => import('./pages/cerimonia/cerimonia.component').then(m => m.CerimoniaComponent)
  },
  {
    path: 'festa',
    loadComponent: () => import('./pages/festa/festa.component').then(m => m.FestaComponent)
  },
  {
    path: 'presentes',
    component: PresentesComponent
  },
  {
    path: 'confirmar',
    loadComponent: () => import('./pages/confirmar/confirmar.component').then(m => m.ConfirmarComponent)
  },
  {
    path: 'spotify',
    loadComponent: () => import('./pages/spotify/spotify.component').then(m => m.SpotifyComponent)
  },
  {
    path: 'fotos',
    loadComponent: () => import('./pages/fotos/fotos.component').then(m => m.FotosComponent)
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent)
  },
  { path: 'login', component: LoginComponent },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/convidados', component: ConvidadosComponent },
  { path: 'admin/presentes', component: PresentesComponent },
  { path: 'admin/fotos', component: FotosComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
