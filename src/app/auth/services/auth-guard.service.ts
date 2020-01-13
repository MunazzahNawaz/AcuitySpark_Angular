import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private authService: AuthService,
    private router: Router,
    private appConfig: AppConfigService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

    if (this.authService.isLoggedIn()) {
      // console.log('logged in user', this.authService.getUser());
      // console.log('in auth guard scopes', this.appConfig.getConfig('AuthScopes'));
      // this.authService.getToken(this.appConfig.getConfig('AuthScopes'));
      // this.roleService.update();
      // console.log('route.data', route.data);
      if (this.checkRoles(route.data.roles)) {
        return true;
      } else {
        this.router.navigate(['/error/403']);
        return false;
      }

    } else {
      console.log('NOT LOGGED IN');
      localStorage.setItem('returnUrl', state.url);
      this.authService.login();
    }
    return false;
  }

  checkRoles(allowedRoles) {
    let isAllowed = true;
    const rolesLst = this.appConfig.getConfig('roles');
    const roles = localStorage.getItem('userRoles'); // await this.authService.getUserRoles();
    // console.log('in auth guard all roles', roles);
    // console.log('in auth guard allowedRoles', allowedRoles);

    if ((!roles || roles.length <= 0) && allowedRoles && allowedRoles.length > 0) {
      isAllowed = false;
    } else if (allowedRoles && allowedRoles.length > 0) {
      allowedRoles.forEach(role => {
        const roleExists = rolesLst.filter(x => x.Name == role);
        let roleKey = 'NA';
        if (roleExists && roleExists.length > 0) {
          roleKey = roleExists[0].Key;
        }
        console.log('in auth guard role Key', roleKey);
        if (roles.includes(roleKey)) {
          isAllowed = true;
        } else {
          isAllowed = false;
        }
      });
    }
    return isAllowed;
  }
}
