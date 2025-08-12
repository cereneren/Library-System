// src/app/core/auth.service.ts
import { Injectable } from '@angular/core';

type Role = 'LIBRARIAN' | 'MEMBER';

@Injectable({ providedIn: 'root' })
export class AuthService {
  getUser() {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) as { id: number|null; role: Role|null } : null;
  }
  isMember(): boolean {
    return this.getUser()?.role === 'MEMBER';
  }
}
