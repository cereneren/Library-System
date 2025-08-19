import { Component, OnInit } from '@angular/core';
import { MemberService } from '../member.service';
import { BookService } from '../../book/book.service';
import { Member } from '../member';
import { Book } from '../../book/book';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Loan } from '../../loan/loan';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import { I18nService } from '../../../services/i18n.service';

type Role = 'LIBRARIAN' | 'MEMBER';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  locale$ = this.i18n.locale$;
  member: Member = { id: 0, fullName: '', email: '', password: '', dateCreated: '', dateUpdated: '' };
  members: Member[] = [];
  loans: Loan[] = [];
  books: Book[] = [];
  loansLoading = false;
  returning: Record<number, boolean> = {};

  selectedMemberId: number | null = null;
  selectedBookId: number | null = null;
  borrowing = false;

  // legacy string holders (not used for popups anymore, but kept if your template references them)
  borrowSuccess = '';
  borrowError = '';
  borrowErrorDetails = '';

  public apiUrl = environment.apiUrl;
  deleting: Record<number, boolean> = {};
  deleteError = '';

  constructor(
    private memberService: MemberService,
    private bookService: BookService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService,
    private i18n: I18nService
  ) {}

  // ---------- helpers ----------
  private t(key: string, params?: Record<string, any>) {
    return this.translate.instant(key, params);
  }

  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
  });

  get session() {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null') as { id: number; role: Role } | null;
    } catch {
      return null;
    }
  }

  get role(): Role | null {
    return this.session?.role ?? null;
  }

  get userId(): number | null {
    return this.session?.id ?? null;
  }

  get isMemberSelf(): boolean {
    return this.role === 'MEMBER' && this.member.id === this.userId;
    // member sees their own page
  }

  // ---------- lifecycle ----------
  ngOnInit(): void {
    this.getAllMembers();
    this.getAllBooks();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMember(parseInt(id, 10));
    } else {
      console.error('No member ID provided in route');
      this.toast.fire({ icon: 'info', title: this.t('MEMBERS.NO_ID') });
    }
  }

  // ---------- data loads ----------
  loadMember(id: number): void {
    this.memberService.getMemberDetail(id).subscribe({
      next: (member: Member) => {
        this.member = member;
        this.selectedMemberId = member.id || null; // default borrow target
        this.loadLoans(member.id!);
      },
      error: (error) => {
        console.error('Error loading member:', error);
        Swal.fire({ icon: 'error', title: this.t('COMMON.ERROR'), text: this.t('MEMBERS.LOAD_FAILED') });
      }
    });
  }

  loadLoans(memberId: number) {
    this.loansLoading = true;
    this.memberService.getMemberLoans(memberId).pipe(finalize(() => this.loansLoading = false))
      .subscribe({
        next: (loans) => this.loans = loans ?? [],
        error: (e) => {
          console.error('Failed to load loans', e);
          Swal.fire({ icon: 'error', title: this.t('COMMON.ERROR'), text: this.t('LOANS.LOAD_FAILED') });
        }
      });
  }

  getAllBooks() {
    this.bookService.getAllBooks().subscribe({
      next: (books: Book[]) => (this.books = books),
      error: (error: HttpErrorResponse) => {
        console.error('Error loading books:', error.message);
        Swal.fire({ icon: 'error', title: this.t('COMMON.ERROR'), text: this.t('BOOKS.LOAD_FAILED') });
      }
    });
  }

  getAllMembers() {
    this.memberService.getAllMembers().subscribe({
      next: (members: Member[]) => (this.members = members),
      error: (error: HttpErrorResponse) => {
        console.error('Error loading members:', error.message);
        Swal.fire({ icon: 'error', title: this.t('COMMON.ERROR'), text: this.t('MEMBERS.LIST_LOAD_FAILED') });
      }
    });
  }

  // ---------- computed ----------
  get totalLoans(): number {
    return this.loans?.length ?? 0;
  }
  get activeLoans(): number {
    return (this.loans ?? []).filter(l => !l.returnDate).length;
  }
  get overdueLoans(): number {
    const today = new Date();
    return (this.loans ?? []).filter(l => !l.returnDate && new Date(l.dueDate) < today).length;
  }
  get availableBooks(): Book[] {
    return (this.books ?? []).filter(b => b.available === true);
  }

  isOverdue(l: Loan) {
    return !l.returnDate && new Date(l.dueDate) < new Date();
  }

  // ---------- actions ----------
  onBorrow(): void {
    const memberId = this.member?.id;
    if (!memberId || !this.selectedBookId) {
      Swal.fire({ icon: 'info', title: this.t('COMMON.INFO'), text: this.t('MEMBERS.CHOOSE_BOOK') });
      return;
    }

    this.borrowing = true;
    this.http.post<Loan>('/api/loans', { memberId, bookId: this.selectedBookId })
      .pipe(finalize(() => this.borrowing = false))
      .subscribe({
        next: () => {
          this.toast.fire({ icon: 'success', title: this.t('MEMBERS.BORROW_SUCCESS') });
          this.selectedBookId = null;
          this.loadLoans(memberId);
        },
        error: (err: HttpErrorResponse) => {
          const msg = typeof err.error === 'string'
            ? err.error
            : err.error?.message || this.t('MEMBERS.BORROW_FAILED');
          Swal.fire({ icon: 'error', title: this.t('COMMON.ERROR'), text: msg });
        }
      });
  }

  onReturn(loan: Loan) {
    this.returning[loan.id] = true;
    this.memberService.returnLoan(loan.id)
      .pipe(finalize(() => (this.returning[loan.id] = false)))
      .subscribe({
        next: () => {
          this.toast.fire({ icon: 'success', title: this.t('MEMBERS.RETURN_SUCCESS') });
          this.loadLoans(this.member.id!);
        },
        error: (e: HttpErrorResponse) => {
          const msg = typeof e.error === 'string'
            ? e.error
            : e.error?.message || this.t('MEMBERS.RETURN_FAILED');
          Swal.fire({ icon: 'error', title: this.t('COMMON.ERROR'), text: msg });
        }
      });
  }

  onDelete(member: Member) {
    const id = member.id as number | undefined;
    if (id == null) return;

    Swal.fire({
      icon: 'warning',
      title: this.t('MEMBERS.CONFIRM_DELETE_TITLE'),
      text: this.t('MEMBERS.CONFIRM_DELETE_TEXT', { name: member.fullName }),
      showCancelButton: true,
      confirmButtonText: this.t('MEMBERS.YES_DELETE'),
      cancelButtonText: this.t('COMMON.CANCEL')
    }).then(result => {
      if (!result.isConfirmed) return;

      this.deleting[id] = true;
      this.memberService.deleteMember(id)
        .pipe(finalize(() => this.deleting[id] = false))
        .subscribe({
          next: () => {
            this.toast.fire({ icon: 'success', title: this.t('MEMBERS.DELETE_SUCCESS') });
            // navigate back to list
            this.router.navigate(['../../'], {
              relativeTo: this.route,
              queryParams: { deleted: id }
            });
          },
          error: (err: HttpErrorResponse) => {
            const msg = typeof err.error === 'string'
              ? err.error
              : err.error?.message || this.t('MEMBERS.DELETE_FAILED');
            Swal.fire({ icon: 'error', title: this.t('COMMON.ERROR'), text: msg });
          }
        });
    });
  }
}
