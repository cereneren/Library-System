import { Component } from '@angular/core';
import { MemberService } from '../member.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-member-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']   // <- plural
})
export class CreateComponent {
  fullName = '';
  email = '';
  password = '';
  showPassword = false;
  isSubmitting = false;

  constructor(
    private memberService: MemberService,
    private router: Router,
    private translate: TranslateService
  ) {}

   // simple, robust email check
   private isValidEmail(e: string) {
     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
   }

   private t(key: string, params?: Record<string, any>) {
     return this.translate.instant(key, params);
   }

   private toast = Swal.mixin({
     toast: true, position: 'top-end', showConfirmButton: false, timer: 2500, timerProgressBar: true
   });

   createMember() {
     if (this.isSubmitting) return;

     const fullName = this.fullName.trim();
     const email = this.email.trim().toLowerCase();  // normalize
     const password = this.password;

     // ✅ All required
     if (!fullName || !email || !password) {
       Swal.fire({ icon: 'info', title: this.t('COMMON.INFO'), text: this.t('MEMBERS.MISSING_FIELDS') });
       return;
     }

     // ✅ Email format must be valid
     if (!this.isValidEmail(email)) {
       Swal.fire({ icon: 'info', title: this.t('COMMON.INFO'), text: this.t('MEMBERS.INVALID_EMAIL') });
       return;
     }

     this.isSubmitting = true;

     this.memberService.createMember({ fullName, email, password })
       .pipe(finalize(() => (this.isSubmitting = false)))
       .subscribe({
         next: () => {
           this.toast.fire({ icon: 'success', title: this.t('MEMBERS.CREATE_SUCCESS') });
           this.fullName = ''; this.email = ''; this.password = ''; this.showPassword = false;
           this.router.navigate(['/members/overview']);
         },
         error: (err: HttpErrorResponse) => {
           const msg = err?.error?.message ?? (typeof err?.error === 'string' ? err.error : this.t('MEMBERS.CREATE_FAILED'));
           Swal.fire({ icon: 'error', title: this.t('COMMON.ERROR'), text: msg });
         }
       });
   }
 }

