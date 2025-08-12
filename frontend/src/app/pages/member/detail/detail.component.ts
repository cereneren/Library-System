import { Component, OnInit } from '@angular/core';
import { MemberService } from '../member.service';
import { BookService } from '../../book/book.service';
import { Member } from '../member';
import { Book } from '../../book/book';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Loan } from '../../loan/loan';
import { Router, ActivatedRoute } from '@angular/router';
type Role = 'LIBRARIAN' | 'MEMBER';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {


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
  }


  public apiUrl = environment.apiUrl;
  deleting: Record<number, boolean> = {};
  deleteError = '';

  member: Member = { id: 0, fullName: '', email: '', password: '', dateCreated: '', dateUpdated: ''};
  members: Member[] = [];
  loans: Loan[] = [];
  books: Book[] = [];
  loansLoading = false;
  returning: Record<number, boolean> = {};

  selectedMemberId: number | null = null;
  selectedBookId: number | null = null;
  borrowing = false;
  borrowSuccess = '';
  borrowError = '';
  borrowErrorDetails = '';

  constructor(
    private memberService: MemberService,
    private bookService: BookService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllMembers();
    this.getAllBooks();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMember(parseInt(id, 10));
    } else {
      console.error('No member ID provided in route');
    }
  }

  private formatBorrowError(err: HttpErrorResponse): string {
    // Keep a copy for a debug toggle (optional)
    this.borrowErrorDetails = typeof err.error === 'string'
      ? err.error
      : JSON.stringify(err.error || {}, null, 2);

   if (err.status === 0)      return 'Cannot reach the server. Please check your internet connection.';
   if (err.status === 400)    return 'Bad request. Please check the fields.';
   if (err.status === 401)    return 'Please log in to continue.';
   if (err.status === 403)    return 'You are not authorized for this operation.';
   if (err.status === 404)    return 'Member or book not found.';
   if (err.status === 409)    return 'This book appears to be already borrowed.';
   if (err.status === 422)    return 'Invalid data. Please check your selection.';
   if (err.status >= 500)     return 'Server error occurred during borrowing. Please try again.';
   return 'An error occurred. Please try again.';
  }

  loadMember(id: number): void {
    this.memberService.getMemberDetail(id).subscribe({
      next: (member: Member) => {
        this.member = member;
        this.selectedMemberId = member.id || null; // 👈 default Borrow to this member
        this.loadLoans(member.id!);
      },
      error: (error) => console.error('Error loading member:', error)
    });
  }

  loadLoans(memberId: number) {
    this.loansLoading = true;
    this.memberService.getMemberLoans(memberId).subscribe({
      next: (loans) => {
        console.log('loans for member', memberId, loans);
        this.loans = loans ?? [];
      },
      error: (e) => console.error('Failed to load loans', e),
      complete: () => (this.loansLoading = false)
    });
  }

  isOverdue(l: Loan) {
    return !l.returnDate && new Date(l.dueDate) < new Date();
  }

  onReturn(loan: Loan) {
    this.returning[loan.id] = true;
    this.memberService.returnLoan(loan.id).subscribe({
      next: () => this.loadLoans(this.member.id!),
      error: (e) => console.error('Return failed', e),
      complete: () => (this.returning[loan.id] = false)
    });
  }

  getAllBooks() {
    this.bookService.getAllBooks().subscribe({
      next: (books: Book[]) => (this.books = books),
      error: (error: HttpErrorResponse) =>
        console.error('Error loading books:', error.message)
    });
  }

  getAllMembers() {
    this.memberService.getAllMembers().subscribe({
      next: (members: Member[]) => (this.members = members),
      error: (error: HttpErrorResponse) =>
        console.error('Error loading members:', error.message)
    });
  }

  // onBorrow uses the page member's id
  onBorrow(): void {
    this.borrowError = '';
    this.borrowErrorDetails = '';
    this.borrowSuccess = '';

    const memberId = this.member?.id;
    if (!memberId || !this.selectedBookId) {
      this.borrowError = 'Please choose a book.';
      return;
    }

    this.borrowing = true;
    this.http.post<Loan>('/api/loans', { memberId, bookId: this.selectedBookId })
      .subscribe({
        next: () => {
          this.borrowing = false;
          this.borrowSuccess = 'Book has been succesfully borrowed.';
          this.selectedBookId = null;
          this.loadLoans(memberId);
        },
        error: (err: HttpErrorResponse) => {
          this.borrowing = false;
          this.borrowError = this.formatBorrowError(err);   // 👈 friendly text
          console.error('Loan failed', err);              // debug only
        }
      });
  }

  onDelete(member: Member) {
    this.deleteError = '';
    const id = member.id as number | undefined;
    if (id == null) return;

    const ok = confirm(`Delete ${member.fullName}? This cannot be undone.`);
    if (!ok) return;

    this.deleting[id] = true;

    this.memberService.deleteMember(id).subscribe({
      next: () => {
        // Option A: navigate to the list (two levels up to /members)
        this.router.navigate(['../../'], {
          relativeTo: this.route,
          queryParams: { deleted: id } // optional: show a toast on the list page
        });

        // (If your detail route is only one level deep, use '../' instead.)
      },
      error: (err: HttpErrorResponse) => {
        this.deleteError =
          typeof err.error === 'string' ? err.error :
          err.error?.message ?? 'Delete failed. Please try again.';
      },
      complete: () => { this.deleting[id] = false; }
    });
  }

  // detail.component.ts
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
}
