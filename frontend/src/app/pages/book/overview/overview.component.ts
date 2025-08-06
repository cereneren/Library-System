import { Component, OnInit }         from '@angular/core';
import { BookService }             from '../book.service';
import { Book }                    from '../book';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-book-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  books: Book[] = [];

  public apiUrl = environment.apiUrl;

  ngOnInit(): void{
    this.getAllBooks();
  }

  constructor(public bookService: BookService) {}

  getAllBooks(){
    this.bookService.getAllBooks()
    .then((response)=> {
      this.books = response.data;
      console.log(response);
    })
    .catch((error)=> {
      return error;
    })
  }

}
