// src/app/core/auth.service.ts
import { Injectable } from '@angular/core';

type Role = 'LIBRARIAN' | 'MEMBER';
type UserInfo = { id: number|null; role: Role|null; token?: string|null };

@Injectable({ providedIn: 'root' })
export class AuthService {
  getUser(): UserInfo | null {
    const data = localStorage.getItem('user');
    return data ? (JSON.parse(data) as UserInfo) : null;
  }
  getRole(): Role | null {
    return this.getUser()?.role ?? null;
  }
  getToken(): string | null {
    return this.getUser()?.token ?? null;
  }
  isMember(): boolean {
    return this.getRole() === 'MEMBER';
  }
  isLibrarian(): boolean {
    return this.getRole() === 'LIBRARIAN';
  }
  hasAnyRole(...roles: Role[]): boolean {
    const r = this.getRole();
    return !!r && roles.includes(r);
  }
  logout() {
    localStorage.removeItem('user');
  }
}
