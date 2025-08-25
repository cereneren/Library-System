// src/app/core/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    if (token) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(req).pipe(
      tap(evt => {
        if (evt instanceof HttpResponse) {
          const authHeader = evt.headers.get('Authorization');
          if (authHeader?.startsWith('Bearer ')) {
            const newToken = authHeader.substring(7);
            if (newToken) this.auth.setToken(newToken); // <-- store refreshed JWT
          }
        }
      })
    );
  }
}
