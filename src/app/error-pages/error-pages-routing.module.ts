import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { Error403Component } from './error403/error403.component';
import { HeaderComponent } from '../layout/header/header.component';

const routes: Routes = [
  {
    path: '',
   component: HeaderComponent,
    children: [
      {
        path: '404',
        component: NotFoundComponent
      },
      {
        path: '401',
        component: NotAuthorizedComponent
      },
      {
        path: '403',
        component: Error403Component
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorPagesRoutingModule { }
