import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { HomePage } from './pages/home/home.page';
import { isLoggedInGuard, isAdminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  {
    path: 'home',
    component: HomePage,
    canActivate: [isLoggedInGuard],  // só precisa estar logado
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.page').then(m => m.AdminPage),
    canActivate: [isAdminGuard],  // só admin
  },
  {
    path: 'schedule',
    loadComponent: () => import('./pages/schedules/schedules.component').then(m => m.SchedulesComponent),
    canActivate: [isAdminGuard],
  },
  {
    path: 'ministries',
    loadComponent: () => import('./pages/ministries/ministries.page').then( m => m.MinistriesPage),
    canActivate: [isAdminGuard],
  },
  {
    path: 'user-schedule',
    loadComponent: () => import('./pages/user-schedule/user-schedule.page').then( m => m.UserSchedulePage),
    canActivate: [isLoggedInGuard],
  },
  {
    path: 'sabbath-school',
    loadComponent: () => import('./pages/sabbath-school/sabbath-school.page').then( m => m.SabbathSchoolPage)
  },
];
