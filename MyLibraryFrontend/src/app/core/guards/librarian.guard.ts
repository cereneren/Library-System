import { CanActivateFn } from '@angular/router';

// src/app/core/guards/librarian.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({ providedIn: 'root' })
export class LibrarianGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    return this.auth.isLibrarian() ? true : this.router.parseUrl('/forbidden');
  }
}
