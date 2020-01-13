import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth-guard.service';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';

const routes: Routes = [ {
  path: '',
  component: LoginComponent,
  canActivate: [AuthGuard]
  },
  {
    path: 'callback',
    component: AuthCallbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
