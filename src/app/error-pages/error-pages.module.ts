import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorPagesRoutingModule } from './error-pages-routing.module';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { from } from 'rxjs';
import { LayoutModule } from '../layout/layout.module';
import { Error403Component } from './error403/error403.component';
import {MatTooltipModule} from '@angular/material/tooltip';



@NgModule({
  declarations: [NotAuthorizedComponent, NotFoundComponent, Error403Component],
  imports: [
    CommonModule,
    ErrorPagesRoutingModule,
    LayoutModule,
    MatTooltipModule
  ],
})
export class ErrorPagesModule { }
