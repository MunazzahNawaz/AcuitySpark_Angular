import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfigService } from 'src/app/app-config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  error = '';
  isError = false;
  constructor(private router: Router, private appConfig: AppConfigService) {}

  ngOnInit() {}
  onLogin(username, pswd) {
    console.log('username', username);
    console.log('pswd', pswd);
    console.log(
      'AppConfig.defaultUsername',
      this.appConfig.getConfig('defaultUsername')
    );
    console.log(
      'AppConfig.defaultPswd',
      this.appConfig.getConfig('defaultPswd')
    );
    if (
      username === this.appConfig.getConfig('defaultUsername') &&
      pswd === this.appConfig.getConfig('defaultPswd')
    ) {
      console.log('correct');
      this.router.navigateByUrl('customer/data');
      return true;
    } else {
      console.log('incorrect');
      this.error = 'Invalid Username or Password';
      this.isError = true;
      return false;
    }
  }
}
