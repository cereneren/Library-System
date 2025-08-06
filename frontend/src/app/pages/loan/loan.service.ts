import { Injectable } from '@angular/core';
import axios from 'axios'
import {Loan} from './loan'

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  constructor() { }

   getAllLoans(): Promise<any> {
      return axios.get('./api/loans');
    }

    getLoanDetail(id: number): Promise<any> {
      return axios.get(`./api/loans/${id}`);
    }

    updateLoan(request: any): Promise<any> {
      let reqData = {
          title: request.title,
          author: request.author,
          available: request.available

      }
      return axios.put(`./api/loans/${request.id}`, reqData);
    }

    createLoan(request: any): Promise<any>{
          let reqData = {
              title: request.title,
              author: request.author,
              available: request.available

          }
        return axios.post('./api/loans', reqData);
    }

    deleteLoan(id: number): Promise<any> {
        return axios.delete(`./api/loans/${id}`);
      }

}
