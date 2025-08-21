import { Component, OnInit } from '@angular/core';
import { MemberService } from '../member.service';
import { Member } from '../member';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-member-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  members: Member[] = [];
  deleting: Record<number, boolean> = {};
  deleteError = '';
  page: number = 1; // current page
  searchTerm = '';

  constructor(public memberService: MemberService) {}

  ngOnInit(): void {
    this.getAllMembers();
  }

  getAllMembers() {
    this.memberService.getAllMembers().subscribe({
      next: (members) => this.members = members,
      error: (e: HttpErrorResponse) =>
        console.error('Error loading members:', e.message)
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
        this.members = this.members.filter(m => m.id !== id);
      },
      error: (err: HttpErrorResponse) => {
        this.deleteError =
          typeof err.error === 'string' ? err.error :
          err.error?.message ?? 'Delete failed. Please try again.';
      },
      complete: () => { this.deleting[id] = false; }
    });
  }

  get displayedMembers() {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) return this.members;
    return this.members.filter(m =>
      (m.fullName || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q)
    );
  }


  onPageChange(page: number) {
    this.page = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearSearch() {
    this.searchTerm = '';
    this.page = 1;
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.page = 1; // jump to first page on any search change
  }
}
