import { Component, OnInit } from '@angular/core';
import { MemberService }             from '../member.service';
import { Member }                    from '../member';
import {ActivatedRoute}            from '@angular/router';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Loan } from '../../loan/loan';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {
  public apiUrl = environment.apiUrl;
  member: Member = {id: 0, fullName: '', email: '', password:''};
  loans: Loan[] = [];
  loansLoading = false;
  returning: Record<number, boolean> = {};

    // Inject ActivatedRoute
    constructor(
      private memberService: MemberService,
      private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
      // Get ID from route parameters
      const id = this.route.snapshot.paramMap.get('id');

      if (id) {
        this.loadMember(parseInt(id, 10));
      } else {
        console.error('No member ID provided in route');
      }
    }

    loadMember(id: number): void {
      this.memberService.getMemberDetail(id).subscribe({
        next: (member: Member) => {
          this.member = member;
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
        complete: () => this.loansLoading = false
      });
    }

      isOverdue(l: Loan) {
        return !l.returnDate && new Date(l.dueDate) < new Date();
      }

      onReturn(loan: Loan) {
        this.returning[loan.id] = true;
        this.memberService.returnLoan(loan.id).subscribe({
          next: () => {
            const id = this.member?.id;
            if (id != null) this.loadLoans(id);   // narrow to number
          },
          error: (e) => console.error('Return failed', e),
          complete: () => this.returning[loan.id] = false
        });
      }
}
