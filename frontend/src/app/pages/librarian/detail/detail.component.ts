// pages/librarian/detail/detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibrarianService } from '../librarian.service';
import { Librarian } from '../librarian';

@Component({
  selector: 'app-librarian-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  librarian!: Librarian;

  constructor(private svc: LibrarianService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.svc.getById(id).subscribe({
        next: (u) => this.librarian = u,
        error: (e) => console.error('load failed', e)
      });
    }
  }
}
