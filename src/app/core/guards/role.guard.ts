import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Role } from '../models/role.model';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = (route.data['roles'] as Role[]) ?? [];
  const activeRole = authService.sessionSnapshot?.user.role;

  if (activeRole && allowedRoles.includes(activeRole)) {
    return true;
  }

  if (activeRole) {
    return router.createUrlTree([`/${activeRole}`]);
  }

  return router.createUrlTree(['/auth']);
};
