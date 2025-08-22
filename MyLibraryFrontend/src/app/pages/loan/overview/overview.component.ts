import { Component, OnInit } from '@angular/core';
import { LoanService, Loan } from '../loan.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { I18nService } from '../../../services/i18n.service';

type Role = 'LIBRARIAN' | 'MEMBER';

@Component({
  selector: 'app-loans',
  standalone: false,
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  locale$ = this.i18n.locale$;
  loans: Loan[] = [];
  loading = false;
  error = '';
  returning: Record<number, boolean> = {};
  page: number = 1; // current page

  filters = { returned: true, onLoan: true, overdue: true };

  private get session() {
    try { return JSON.parse(localStorage.getItem('user') || 'null') as { id:number; role:Role } | null; }
    catch { return null; }
  }
  get role(): Role | null { return this.session?.role ?? null; }
  get userId(): number | null { return this.session?.id ?? null; }
  get isLibrarian() { return this.role === 'LIBRARIAN'; }

  constructor(private loanSvc: LoanService, private i18n: I18nService) {}

  ngOnInit() { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.loans = [];

    const user = this.getCurrentUser();
    if (!user) {
      this.error = 'User is not found.';
      this.loading = false;
      return;
    }

    let src$: Observable<Loan[]> | null = null;

    if (user.role === 'LIBRARIAN') {
      src$ = this.loanSvc.getAllLoans();
    } else if (user.role === 'MEMBER') {
      if (!user.id) {
        this.error = 'Member id not found.';
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
      const overdue    = !isReturned && this.isOverdue(l.dueDate);
      const onLoan     = !isReturned && !overdue;

      return (isReturned && this.filters.returned)
          || (onLoan     && this.filters.onLoan)
          || (overdue    && this.filters.overdue);
    });
  }

  get allChecked()  { return this.filters.returned && this.filters.onLoan && this.filters.overdue; }
  get noneChecked() { return !this.filters.returned && !this.filters.onLoan && !this.filters.overdue; }
  get isCustom()    { return !this.allChecked && !this.noneChecked; }

  setAllFilters(v: boolean) {
    this.filters = { returned: v, onLoan: v, overdue: v };
  }

  onPageChange(page: number) {
    this.page = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearSearch() { this.page = 1; }
  onSearchChange(term: string) { this.page = 1; }

  // --- Overdue helpers ---
  isOverdue(dueIso?: string | Date | null): boolean {
    if (!dueIso) return false;
    return this.daysDiffFromToday(dueIso) < 0;
  }

  daysOverdue(dueIso?: string | Date | null): number {
    if (!dueIso) return 0;
    const d = this.daysDiffFromToday(dueIso);
    return d < 0 ? -d : 0;
  }

  daysUntil(dueIso?: string | Date | null): number {
    if (!dueIso) return 0;
    const d = this.daysDiffFromToday(dueIso);
    return d > 0 ? d : 0;
  }

  // Signed whole-day difference: (due - today)
  private daysDiffFromToday(dateLike: string | Date): number {
    const due = new Date(dateLike);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfDue   = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const ms = startOfDue.getTime() - startOfToday.getTime();
    return Math.floor(ms / 86400000);
  }
}
