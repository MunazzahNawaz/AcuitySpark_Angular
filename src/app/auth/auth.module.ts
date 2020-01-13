import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [LoginComponent, AuthCallbackComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    NgxSpinnerModule
  ]
})


export class AuthModule { }
