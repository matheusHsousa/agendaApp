import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { HomePage } from './pages/home-components/home/home.page';
import { isLoggedInGuard, isAdminGuard } from './guards/auth.guard';
import { BibliaPage } from './pages/library/biblia/biblia.page';
import { MeditacoesPage } from './pages/library/meditacoes/meditacoes.page';
import { LeitorPdfComponent } from './pages/library/leitor-pdf/leitor-pdf.page';


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
        path: 'programacao-admin',
        loadComponent: () => import('./pages/admin/admin-components/programacao-admin/programacao-admin.page').then(m => m.ProgramacaoAdminPage),
        canActivate: [isAdminGuard],
      },
      {
        path: 'escala-admin',
        loadComponent: () => import('./pages/admin/admin-components/escala-admin/escala-admin.page').then(m => m.EscalaAdminPage),
        canActivate: [isAdminGuard],
      },
      {
        path: 'schedule',
        loadComponent: () => import('./pages/home-components/schedules/schedules.component').then(m => m.SchedulesComponent),
        canActivate: [isAdminGuard],
      },
      {
        path: 'ministries',
        loadComponent: () => import('./pages/admin/admin-components/ministries/ministries.page').then(m => m.MinistriesPage),
        canActivate: [isAdminGuard],
      },
      {
        path: 'user-schedule',
        loadComponent: () => import('./pages/admin/admin-components/user-schedule/user-schedule.page').then(m => m.UserSchedulePage),
        canActivate: [isLoggedInGuard],
      },
      {
        path: 'sabbath-school',
        loadComponent: () => import('./pages/home-components/sabbath-school/sabbath-school.page').then(m => m.SabbathSchoolPage),
        canActivate: [isLoggedInGuard],
      },
      {
        path: 'iframe-medi',
        loadComponent: () => import('./pages/library/iframe-medi/iframe-medi.page').then(m => m.IframeMediPage),
        canActivate: [isLoggedInGuard],
      },
      {
        path: 'hub-cronograma',
        loadComponent: () => import('./pages/home-components/hub-cronograma/hub-cronograma.page').then(m => m.HubCronogramaPage),
        canActivate: [isLoggedInGuard],
      },
      {
        path: 'livro-viewer',
        loadComponent: () => import('./pages/library/leitor-pdf/leitor-pdf.page').then(m => m.LeitorPdfComponent),
        canActivate: [isLoggedInGuard],
      },
      {
        path: 'programacao',
        loadComponent: () => import('./pages/home-components/times-temp/programacao/programacao.page').then(m => m.ProgramacaoPage),
        canActivate: [isLoggedInGuard],
      },
      {
        path: 'escala',
        loadComponent: () => import('./pages/home-components/times-temp/escala/escala.page').then(m => m.EscalaPage),
        canActivate: [isLoggedInGuard],
      },

      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'biblia', redirectTo: 'biblia', pathMatch: 'full' },
      { path: 'meditacoes', redirectTo: 'meditacoes', pathMatch: 'full' },
    ],
  },
];

