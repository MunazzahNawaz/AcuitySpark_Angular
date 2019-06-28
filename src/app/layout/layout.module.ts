import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './aside/aside.component';

@NgModule({
  declarations: [HeaderComponent, AsideComponent],
  imports: [
    CommonModule,
    LayoutRoutingModule
  ],
  exports: [
    AsideComponent
  ]
})
export class LayoutModule { }
