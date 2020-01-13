import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { scan } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  // A stream that exposes all the roles a user has
  roles$ = new ReplaySubject<string[]>(1);

  roleUpdates$ = new BehaviorSubject(['']);

  constructor() {
    this.roleUpdates$
      .pipe(
        scan((acc, next) => next, [])
      )
      .subscribe(this.roles$);
  }

  async update() {
    //  let roles = await this.authService.getUserRoles();
    //  console.log('roles in role service', roles);
    //  localStorage.setItem('userRoles', roles);
    const roles = localStorage.getItem('userRoles') != undefined ? JSON.parse(localStorage.getItem('userRoles')) : [];
    this.roleUpdates$.next(roles);
  }

  updateRoles(roles) {
    this.roleUpdates$.next(roles);
  }
}
