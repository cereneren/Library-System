import { Component, OnInit } from '@angular/core';
import { MemberService }             from '../member.service';
import { Member }                    from '../member';
import {ActivatedRoute}            from '@angular/router';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {
  public apiUrl = environment.apiUrl;
  member: Member = {id: 0, fullName: '', email: '', password:''};

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
        },
        error: (error) => {
          console.error('Error loading member:', error);
          // Handle error (e.g., show message to user)
        }
      });
    }
}
