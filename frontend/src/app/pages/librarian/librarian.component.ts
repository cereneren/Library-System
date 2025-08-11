// pages/librarian/librarian.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-librarian',
  template: `<h1 class="m-3">Redirecting...</h1>`,
})
export class LibrarianComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const userId = 6; // hardcoded for now
    this.router.navigate([userId, 'detail'], { relativeTo: this.route });
    // This yields /librarian/6/detail because this component sits at /librarian
  }
}
