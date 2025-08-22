import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from '../member.service';
import { Member } from '../member';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-member-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']   // <- plural
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
      next: (m) => this.member = m,
      error: (err) => console.error('Failed to load member', err)
    });
  }

  async save() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const payload = {
      id: this.member.id,
      fullName: (this.member.fullName || '').trim(),
      email: (this.member.email || '').trim()
    };

    try {
      const res = await firstValueFrom(this.memberService.updateMember(payload));

      const auth = res.headers.get('Authorization');
      if (auth?.startsWith('Bearer ')) {
        localStorage.setItem('token', auth.substring(7));
      }
      this.member = res.body ?? this.member;

      // navigate back to detail (optional)
      await this.router.navigate(['../', 'detail'], { relativeTo: this.route });
    } catch (e) {
      console.error('Update failed', e);
    } finally {
      this.isSubmitting = false;
    }
  }
}
