import { Component, OnInit }         from '@angular/core';
import { LoanService }             from '../loan.service';
import { Loan }                    from '../loan';

@Component({
  selector: 'app-loan-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  loan: Loan[] = [];

  ngOnInit(): void{
    this.getAllLoans();
  }

  constructor(public loanService: LoanService) {}

  getAllLoans(){
    this.loanService.getAllLoans()
    .then((response)=> {
      this.loan = response.data;
      console.log(response);
    })
    .catch((error)=> {
      return error;
    })
  }

}
