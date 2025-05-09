import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Trying to access URL:', state.url); 

  if (authService.isLoggedIn) {
    return true;
  } else if(state.url === '/create-account') {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
