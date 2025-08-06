import { Injectable } from '@angular/core';
import axios from 'axios'
import {Book} from './book'

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor() { }

   getAllBooks(): Promise<any> {
      return axios.get('./api/books');
    }

    getBookDetail(id: number): Promise<any> {
      return axios.get(`./api/books/${id}`);
    }

    updateBook(request: any): Promise<any> {
      let reqData = {
          title: request.title,
          author: request.author,
          available: request.available

      }
      return axios.put(`./api/books/${request.id}`, reqData);
    }

    createBook(request: any): Promise<any>{
          let reqData = {
              title: request.title,
              author: request.author,
              available: request.available

          }
        return axios.post('./api/books', reqData);
    }

    deleteBook(id: number): Promise<any> {
        return axios.delete(`./api/books/${id}`);
      }
}
