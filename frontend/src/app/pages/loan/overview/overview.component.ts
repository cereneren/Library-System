import { Component, OnInit } from '@angular/core';
import { LoanService, Loan } from '../loan.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

type Role = 'LIBRARIAN' | 'MEMBER';

@Component({
  selector: 'app-loans',
  standalone: false,
  templateUrl: './overview.component.html'
})
export class OverviewComponent implements OnInit {
  loans: Loan[] = [];
  loading = false;
  error = '';
  returning: Record<number, boolean> = {};

  filters = { returned: true, onLoan: true, overdue: true };

  private get session() {
    try { return JSON.parse(localStorage.getItem('user') || 'null') as { id:number; role:Role } | null; }
    catch { return null; }
  }
  get role(): Role | null { return this.session?.role ?? null; }
  get userId(): number | null { return this.session?.id ?? null; }
  get isLibrarian() { return this.role === 'LIBRARIAN'; }

  constructor(private loanSvc: LoanService) {}

  ngOnInit() { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.loans = [];

    const user = this.getCurrentUser(); // { id: number|null, role: string|null } | null
    if (!user) {
      this.error = 'Please sign in.';
      this.loading = false;
      return;
    }

    let src$: Observable<Loan[]> | null = null;

    if (user.role === 'LIBRARIAN') {
      src$ = this.loanSvc.getAllLoans();
    } else if (user.role === 'MEMBER') {
      if (!user.id) {
        this.error = 'Member id not found. Please sign in again.';
        this.loading = false;
        return;
      }
      src$ = this.loanSvc.getLoansForMember(user.id);
    } else {
      this.error = 'Unknown role.';
      this.loading = false;
      return;
    }

    src$!.subscribe({
      next: loans => { this.loans = loans ?? []; },
      error: (err: HttpErrorResponse) => {
        this.error = typeof err.error === 'string'
          ? err.error
          : err.error?.message || 'Loans could not be loaded.';
        this.loading = false;
      },
      complete: () => { this.loading = false; }
    });
  }

  /** Helper: read {id, role} from localStorage, with JWT fallback */
  private getCurrentUser(): { id: number | null; role: string | null } | null {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        return {
          id: typeof u?.id === 'number' ? u.id : (u?.id ? Number(u.id) : null),
          role: u?.role ?? null
        };
      }
    } catch {}

    // Fallback: decode access token if present
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const id = Number(payload.userId ?? payload.id ?? payload.sub) || null;
        const role =
          (Array.isArray(payload.roles) ? payload.roles[0] : payload.roles) ??
          (Array.isArray(payload.role) ? payload.role[0] : payload.role) ??
          null;
        return { id, role };
      } catch {}
    }

    return null;
  }

  isOverdue(l: Loan) { return !l.returnDate && new Date(l.dueDate) < new Date(); }

  onReturn(l: Loan) {
    if (!this.isLibrarian) return;
    this.returning[l.id] = true;
    this.loanSvc.returnLoan(l.id).subscribe({
      next: () => this.load(),
      error: () => {},
      complete: () => this.returning[l.id] = false
    });
  }



  get filteredLoans() {
    return this.loans.filter(l => {
      const isReturned = !!l.returnDate;
      const isOverdue  = !isReturned && this.isOverdue(l);
      const isOnLoan   = !isReturned && !isOverdue;

      return (isReturned && this.filters.returned)
          || (isOnLoan   && this.filters.onLoan)
          || (isOverdue  && this.filters.overdue);
    });
  }

  setAllFilters(v: boolean) {
    this.filters = { returned: v, onLoan: v, overdue: v };
  }
}
