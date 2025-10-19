import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['34375783/user/login'], { queryParams: { returnUrl: state.url } });
  }
  return true;
};