import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfigService } from 'src/app/app-config.service';
import { UserSettingService } from 'src/app/layout/services/user-setting.service';
import { StoreService } from 'src/app/customer/services/store.service';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  error = '';
  isError = false;
  returnUrl;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private storeService: StoreService) { }

  ngOnInit() {

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (this.authService.isLoggedIn()) {

      const user: User = {
        username: this.authService.getUserName(),
        email: this.authService.getEmail()
      };
      this.storeService.setUser(user);
      if (user && user.email && user.email != null) {
        localStorage.setItem('userId', user.email.toLowerCase());
      }

      this.router.navigateByUrl('home');
    } else {
      this.authService.login();
      // this.adalSvc.acquireToken('api://b8903e03-f9f9-485e-a5da-988be6516215/api-access').subscribe(x => {
      // })
      // this.adalSvc.handleCallback();
      //  this.authService.getToken();
      // this.msalService.login();
      // this.msalService.aquireAccessToken();
      // let user: User = {
      //   username: this.msalService.getUserName(),
      //   email: this.msalService.getUserEmail()
      // }
      // this.storeService.setUser(user);
      // //get user settings from db against the loggedin user
      // this.userSettingService.getUserSettings(this.msalService.getUserEmail()).subscribe(resp => {
      //   this.storeService.setUserSettings(resp.userSettings);
      // });
      // this.router.navigate([this.returnUrl]);
    }
  }
  // onLogin(username, pswd) {
  //   // this.msalService.logout();
  //   // this.login();
  //   if (
  //     username === this.appConfig.getConfig('defaultUsername') &&
  //     pswd === this.appConfig.getConfig('defaultPswd')
  //   ) {
  //     // if (this.appConfig.getConfig('showImport')) {
  //     this.router.navigateByUrl('home');
  //     // } else {
  //     //   this.router.navigateByUrl('home');
  //     // }

  //     return true;
  //   } else {
  //     this.error = 'Invalid Username or Password';
  //     this.isError = true;
  //     return false;
  //   }
  // }
  // login() {
  //  // this.msalService.login();
  // }
  // isUserLoggedIn() {
  //   return this.authService.isLoggedIn();
  // }
}