import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app-config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  error = '';
  constructor(private router: Router) {}

  ngOnInit() {}
  onLogin(username, pswd) {
    console.log('username', username);
    console.log('pswd', pswd);
    console.log('AppConfig.defaultUsername', AppConfig.defaultUsername);
    console.log('AppConfig.defaultPswd', AppConfig.defaultPswd);
    if (
      username === AppConfig.defaultUsername &&
      pswd === AppConfig.defaultPswd
    ) {
      this.router.navigateByUrl('customer/data');
    } else {
      this.error = 'invalid username or password';
    }
  }
}
