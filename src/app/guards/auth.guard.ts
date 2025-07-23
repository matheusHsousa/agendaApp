// auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

// Guard para verificar login
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
      if (user && user.role === 'Admin') {
        return true;
      }
      router.navigateByUrl('/login');
      return false;
    })
  );
};
