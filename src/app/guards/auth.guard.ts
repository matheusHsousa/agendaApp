// auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const isLoggedInGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user$.pipe(
    take(1),
    map(user => {
      if (user) {
        return true;
      }
      router.navigateByUrl('/login');
      return false;
    })
  );
};

export const isAdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user$.pipe(
    take(1),
    map(user => {
      if (user && (user.role === 'Admin' || user.role === 'master' || user.role === 'ministry')) {
        return true;
      }
      router.navigateByUrl('/tabs/home');
      return false;
    })
  );
};

export const isMasterGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user$.pipe(
    take(1),
    map(user => {
      if (user && user.role === 'master') {
        return true;
      }
      router.navigateByUrl('/tabs/home');
      return false;
    })
  );
};

export const isMinistryGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user$.pipe(
    take(1),
    map(user => {
      if (user && (user.role === 'ministry' || user.role === 'admin' || user.role === 'master')) {
        return true;
      }
      router.navigateByUrl('/tabs/home');
      return false;
    })
  );
};
