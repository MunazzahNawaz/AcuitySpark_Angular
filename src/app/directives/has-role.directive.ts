import { Directive, OnInit, OnDestroy, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { RoleService } from '../auth/services/role.service';
import { takeUntil } from 'rxjs/operators';
import { AppConfigService } from '../app-config.service';
import { AuthService } from '../auth/services/auth.service';

@Directive({
  selector: '[appHasRole]'
})

export class HasRoleDirective implements OnInit, OnDestroy {
  // the role the user must have 
  @Input() appHasRole: string;
  stop$ = new Subject();
  isVisible = false;

  /**
   * @param {ViewContainerRef} viewContainerRef 
   * 	-- the location where we need to render the templateRef
   * @param {TemplateRef<any>} templateRef 
   *   -- the templateRef to be potentially rendered
   * @param {RolesService} rolesService 
   *   -- will give us access to the roles a user has
   */
  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private rolesService: RoleService,
    private authService: AuthService,
    private appconfig: AppConfigService
  ) { }

  ngOnInit() {
    let rolesLst = this.appconfig.getConfig('roles');
    let roleExists = rolesLst.filter(x => x.Name == this.appHasRole);
    let roleKey = '';
    if (roleExists && roleExists.length > 0) {
      roleKey = roleExists[0].Key;
    }

    this.authService.getIsLoginReady().subscribe(isLoggedIn => {
      // console.log('IN dirctive isLoggedIn', isLoggedIn);
      if (isLoggedIn != null && isLoggedIn == true) {
        this.rolesService.roles$.pipe(
          takeUntil(this.stop$)
        ).subscribe(roles => {
          // If he doesn't have any roles, we clear the viewContainerRef
          if (roles == undefined || roles.length <= 0 || roles == null) {
            this.viewContainerRef.clear();
            return;
          }
         // console.log('in directive rolesLst', roles);
          // If the user has the role needed to render this component we can add it
          let roleName = this.appHasRole;
          //  console.log('in directive required role Key', roleKey);
          if (roles.includes(roleKey)) {
            //  console.log('in directive YES GOT IT');
            // If it is already visible (which can happen if his roles changed) we do not need to add it a second time
            if (!this.isVisible) {
              // We update the `isVisible` property and add the templateRef to the view using the  'createEmbeddedView' method of the viewContainerRef
              this.isVisible = true;
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          } else {
            // If the user does not have the role,we update the `isVisible` property and clear the contents of the viewContainerRef
            this.isVisible = false;
            this.viewContainerRef.clear();
          }
        });
      }
    });

  }


  // Clear the subscription on destroy
  ngOnDestroy() {
    this.stop$.next();
  }
}
