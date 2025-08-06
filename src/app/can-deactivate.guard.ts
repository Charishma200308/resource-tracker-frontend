import { CanActivateFn, CanDeactivateFn, Router } from '@angular/router';
import { MyServiceService } from './my-service.service';
import { inject } from '@angular/core';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Promise<boolean>;
}

export const formCanActivateGuard: CanActivateFn = () => {
  const authService = inject(MyServiceService);
  const router = inject(Router);

  const user = authService.getUsername();

  if (user === 'Admin' || user === 'Manager') {
    return true;
  } else {
    router.navigate(['/unauthorized']);
    return false;
  }
  };


export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component
) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};


