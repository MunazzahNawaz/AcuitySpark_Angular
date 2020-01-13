import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoleService } from '../services/role.service';
import { AppConfigService } from 'src/app/app-config.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {

  constructor(
    private _router: Router,
    private authService: AuthService,
    private appConfig: AppConfigService) { }

  ngOnInit() {
    this.authService.getToken(this.appConfig.getConfig('AuthScopes'));
    ///  this.roleService.update();
    let returnUrl = localStorage.getItem('returnUrl');
    if (!returnUrl || returnUrl == null || returnUrl == '' || returnUrl == '/') {
      returnUrl = '/home';
    }
    this._router.navigate([returnUrl]);
  }

}
