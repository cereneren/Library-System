// pages/librarian/detail/detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibrarianService } from '../librarian.service';
import { Librarian } from '../librarian';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-librarian-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  locale$ = this.i18n.locale$;
  librarian!: Librarian;

  constructor(private svc: LibrarianService, private route: ActivatedRoute, private i18n: I18nService) {}

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
