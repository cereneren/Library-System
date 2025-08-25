// src/app/core/auth.service.ts
import { Injectable } from '@angular/core';

type Role = 'LIBRARIAN' | 'MEMBER';
type UserInfo = { id: number|null; role: Role|null; token?: string|null; email?: string|null; fullName?: string|null };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readUser(): UserInfo | null {
    const data = localStorage.getItem('user');
    return data ? (JSON.parse(data) as UserInfo) : null;
  }
  private writeUser(u: UserInfo | null) {
    if (u) localStorage.setItem('user', JSON.stringify(u));
    else localStorage.removeItem('user');
  }

  getUser(): UserInfo | null { return this.readUser(); }
  setUser(u: UserInfo) { this.writeUser(u); }

  getRole(): Role | null { return this.getUser()?.role ?? null; }

  getToken(): string | null {
    // prefer token inside user object; fallback to legacy 'token' key if you used that before
    return this.getUser()?.token ?? localStorage.getItem('token');
  }

  setToken(token: string | null) {
    // keep both locations in sync to avoid surprises
    const user = this.getUser() ?? { id: null, role: null } as UserInfo;
    user.token = token;
    this.writeUser(user);
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }

  isMember(): boolean { return this.getRole() === 'MEMBER'; }
  isLibrarian(): boolean { return this.getRole() === 'LIBRARIAN'; }
  hasAnyRole(...roles: Role[]): boolean {
    const r = this.getRole();
    return !!r && roles.includes(r);
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}
