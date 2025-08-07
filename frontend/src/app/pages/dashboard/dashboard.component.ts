import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';     // ← add this
import { Router }     from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  users: any[]=[];

  constructor(private http:HttpClient){
    this.loadUsers();
  }

  loadUsers() {
    this.http.get('./api/members').subscribe((res: any) => {
    this.users = res.data;
    })
  }
}
