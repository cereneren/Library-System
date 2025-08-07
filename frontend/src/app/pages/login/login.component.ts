import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginObj: any = {
    "email": "",
    "password": ""
  };

  constructor(private http: HttpClient, private router: Router){}

  onLogin(){
    this.http.post('http://localhost:8080/api/auth/login', this.loginObj).subscribe((res:any) => {
     if(res.token != null) {
      alert('Login is succesful');
      localStorage.setItem('loginTOken', res.token);
        if(res.roles === "MEMBER" || res.roles === "LIBRARIAN") {
                this.router.navigateByUrl('/dashboard');
        }
     }else {
      alert(res.message);
      }
     })
  }
}

