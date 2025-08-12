import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const user = this.getSession();
    if (user?.role === 'MEMBER' && user?.id) {
      // Redirect to their own detail page
      this.router.navigate([user.id, 'detail'], { relativeTo: this.route });
    }
    else {
      this.router.navigate(['overview'], { relativeTo: this.route });
    }
  }

  private getSession(): { id: number; role: string } | null {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }
}
