// create.component.ts
import { Component } from '@angular/core';
import { MemberService } from '../member.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-member-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']   // <- plural
})
export class CreateComponent {
  fullName = '';
  email = '';
  password = '';
  isSubmitting = false;

  // 👇 add this line
  showPassword = false;

  constructor(private memberService: MemberService, private router: Router) {}

  createMember() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.memberService.createMember({
      fullName: this.fullName.trim(),
      email: this.email.trim(),
      password: this.password
    }).pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          Swal.fire('Success', 'Member created successfully!', 'success');
          this.fullName = this.email = this.password = '';
          this.router.navigate(['/members/overview']);
        },
        error: (err) => {
          const msg = err?.error?.message ?? (typeof err?.error === 'string' ? err.error : 'Failed to create member');
          Swal.fire('Error', msg, 'error');
        }
      });
  }

}
