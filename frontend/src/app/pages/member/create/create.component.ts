import { Component } from '@angular/core';
import { Member } from '../member';
import { MemberService } from '../member.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-member-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';
  isSubmitting: boolean = false; // ✅ Added

  constructor(public memberService: MemberService) {}

  createMember() {
    this.isSubmitting = true;
    this.memberService.createMember({
      fullName: this.fullName,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        Swal.fire('Success', 'Member created successfully!', 'success');
        this.isSubmitting = false;
      },
      error: (err) => {
        Swal.fire('Error', 'Failed to create member', 'error');
        this.isSubmitting = false;
      }
    });
  }
}
