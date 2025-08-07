import { Component, OnInit } from '@angular/core';
import { HttpClient }      from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  users: any[] = [];

  constructor(private http: HttpClient) { console.log('🚀 DashboardComponent constructor');  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<{ data: any[] }>('/api/members')
      .subscribe({
        next: ({ data }) => this.users = data,
        error: err        => console.error('Load users failed', err)
      });
  }
}
