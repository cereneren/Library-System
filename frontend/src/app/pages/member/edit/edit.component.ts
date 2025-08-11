import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from '../member.service';
import { Member } from '../member';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-member-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {

  member: Member = { id: 0, fullName: '', email: '', password: '', dateCreated: '', dateUpdated: ''};
  isSubmitting = false;

  constructor(
    public memberService: MemberService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      console.error('No member ID in route');
      return;
    }

    this.memberService.getMemberDetail(id).subscribe({
      next: (m: Member) => this.member = m,
      error: (err) => console.error('Failed to load member', err)
    });
  }

   async save() {
      this.isSubmitting = true;
      const payload: Member = {
        id: this.member.id,
        fullName: this.member.fullName?.trim() ?? '',
        email: this.member.email?.trim() ?? ''
      } as Member;

      try {
        await firstValueFrom(this.memberService.updateMember(payload));
        await this.router.navigate(['..','detail'], { relativeTo: this.route });
      } catch (e) {
        console.error('Update failed', e);
      } finally {
        this.isSubmitting = false;
      }
    }


}
