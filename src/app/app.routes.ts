import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { HomePage } from './pages/home/home.page';
import { isLoggedInGuard, isAdminGuard } from './guards/auth.guard';
import { BibliaPage } from './pages/biblia/biblia.page';
import { MeditacoesPage } from './pages/meditacoes/meditacoes.page';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  { path: 'login', component: LoginPage },
  
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    canActivate: [isLoggedInGuard],
    children: [
      {
        path: 'home',
        component: HomePage,
        canActivate: [isLoggedInGuard],
      },
      {
        path: 'biblia',
        component: BibliaPage,
        canActivate: [isLoggedInGuard],
      },
        {
        path: 'meditacoes',
        component: MeditacoesPage,
        canActivate: [isLoggedInGuard],
      },
      {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin.page').then(m => m.AdminPage),
        canActivate: [isAdminGuard],
      },
      {
        path: 'schedule',
        loadComponent: () => import('./pages/schedules/schedules.component').then(m => m.SchedulesComponent),
        canActivate: [isAdminGuard],
      },
      {
        path: 'ministries',
        loadComponent: () => import('./pages/ministries/ministries.page').then(m => m.MinistriesPage),
        canActivate: [isAdminGuard],
      },
      {
        path: 'user-schedule',
        loadComponent: () => import('./pages/user-schedule/user-schedule.page').then(m => m.UserSchedulePage),
        canActivate: [isLoggedInGuard],
      },
      {
        path: 'sabbath-school',
        loadComponent: () => import('./pages/sabbath-school/sabbath-school.page').then(m => m.SabbathSchoolPage),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' }, 
      { path: 'biblia', redirectTo: 'biblia', pathMatch: 'full' }, 
      { path: 'meditacoes', redirectTo: 'meditacoes', pathMatch: 'full' }, 
    ],
  },  {
    path: 'iframe-medi',
    loadComponent: () => import('./pages/iframe-medi/iframe-medi.page').then( m => m.IframeMediPage)
  },


];

