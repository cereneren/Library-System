import { Component, OnInit } from '@angular/core';
import { BookService }             from '../book.service';
import { Book }                    from '../book';
import {ActivatedRoute}            from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {
  books: Book[] = [];
  book: Book = {id: 0, title : '', author: ''};

  public apiUrl = environment.apiUrl;

  constructor(public bookService: BookService, private route: ActivatedRoute){
    this.book = {
      id: this.route.snapshot.params['id'],
      title: '',
      author: ''
    }
  }
  ngOnInit(): void{
    this.bookService.getBookDetail(this.route.snapshot.params['id'])
    .then((response) => {
    this.book = response.data;
    console.log(this.book);
    })
    .catch((error)=> {
      return error;
    })
  }
}
