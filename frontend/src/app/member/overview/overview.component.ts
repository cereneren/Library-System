import { Component, OnInit }         from '@angular/core';
import { MemberService }             from '../member.service';
import { Member }                    from '../member';


@Component({
  selector: 'app-member-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  member: Member[] = [];

  ngOnInit(): void{
    this.getAllMembers();
  }

  constructor(public memberService: MemberService) {}

  getAllMembers(){
    this.memberService.getAllMembers()
    .then((response)=> {
      this.member = response.data;
      console.log(response);
    })
    .catch((error)=> {
      return error;
    })
  }

}
