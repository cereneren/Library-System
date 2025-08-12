import { Component, OnInit } from '@angular/core';
import { HttpClient }      from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-librarian',
  templateUrl: './librarian.component.html',
  styleUrl: './librarian.component.css'
})
export class LibrarianComponent {
  constructor(private http: HttpClient, private router: Router){}

  ngOnInit(): void {
    this.loadBooks();
  }
  loadBooks(): void {
      //this.router.navigate(['./books/overview']);
  }
}
