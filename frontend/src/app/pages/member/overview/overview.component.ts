import { Component, OnInit }         from '@angular/core';
import { MemberService }             from '../member.service';
import { Member }                    from '../member';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-member-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  members: Member[] = [];

  public apiUrl = environment.apiUrl;

  ngOnInit(): void{
    this.getAllMembers();
  }

  constructor(public memberService: MemberService) {}

  getAllMembers(){
    this.memberService.getAllMembers().subscribe({
      next: (members: Member[]) => {
        this.members = members;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading members:', error.message);
        // Handle error
      }
    });
  }

}
