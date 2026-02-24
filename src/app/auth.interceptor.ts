import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { tap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // لو الطلب هو login أو register، متضيفش التوكن
  const isAuthRequest = ['/auth/login', '/auth/register'].some(url => req.url.includes(url));
  const clonedReq = token && !isAuthRequest
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  console.log('Interceptor token:', token, 'URL:', req.url);

  return next(clonedReq).pipe(
    tap({
      error: (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 || err.status === 403) {
            console.warn('Unauthorized/Forbidden detected – Logging out');
            authService.logout(); // تنفيذ logout تلقائياً
          }
        }
      }
    })
  );
};