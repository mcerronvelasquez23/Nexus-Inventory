import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const superadminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const payloadDecodificado = JSON.parse(atob(token.split('.')[1]));
      if (payloadDecodificado.rol === 'superadmin') {
        return true; // Acceso autorizado
      }
    } catch (e) {
      console.error('Error de parseo de credenciales de seguridad');
    }
  }

  // Redirección si se intenta violar el acceso perimetral
  router.navigate(['/login']);
  return false;
};