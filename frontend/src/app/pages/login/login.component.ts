// login.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

type Role = 'LIBRARIAN' | 'MEMBER';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginObj = { email: '', password: '' };

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.http.post('http://localhost:8080/api/auth/login', this.loginObj)
      .subscribe({
        next: (res: any) => {
          const token: string | undefined = res?.token;
          if (!token) {
            alert(res?.message || 'Login failed');
            return;
          }

          // Save token (use a consistent key)
          localStorage.setItem('access_token', token);

          // Get role and id from response if present
          let role: Role | null =
            Array.isArray(res?.roles) ? res.roles[0] :
            (res?.roles as Role | undefined) ?? null;

          let id: number | null =
            typeof res?.id === 'number' ? res.id : null;

          // Fallback: decode from JWT payload
          if (!role || !id) {
            const payload = this.decodeJwt(token);
            // role can be in role / roles array
            const jwtRole =
              (Array.isArray(payload.roles) ? payload.roles[0] : payload.roles) ??
              (Array.isArray(payload.role)  ? payload.role[0]  : payload.role);

            const jwtId =
              Number(payload.userId ?? payload.id ?? payload.sub) || null;

            role = (role ?? jwtRole) as Role | null;
            id   = id ?? jwtId;
          }

          // Persist compact user object for later pages (Loans, etc.)
          localStorage.setItem('user', JSON.stringify({ id, role }));

          alert('Login is successful');

          // Route by role
          if (role === 'LIBRARIAN') {
            this.router.navigateByUrl('/dashboard/librarian');
          } else if (role === 'MEMBER') {
            this.router.navigateByUrl('/dashboard/member');
          } else {
            // unknown role → home
            this.router.navigateByUrl('/');
          }
        },
        error: (err) => {
          alert(err?.error?.message || 'Login failed');
        }
      });
  }

  private decodeJwt(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return {};
    }
  }
}
