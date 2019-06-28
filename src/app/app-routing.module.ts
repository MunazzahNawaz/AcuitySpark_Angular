import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [ {
  path: '',
  loadChildren: './auth/auth.module#AuthModule'
},
{
  path: 'customer',
  loadChildren: './customer/customer.module#CustomerModule'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
