import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';

import { LayoutRoutingModule } from './layout-routing.module';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './aside/aside.component';
import { RulesComponent } from './rules/rules.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SaveComponent } from './save/save.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { UserSettingComponent } from './user-setting/user-setting.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [HeaderComponent, AsideComponent, RulesComponent, SaveComponent, UserSettingComponent],
  imports: [
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LayoutRoutingModule,
    PerfectScrollbarModule,
    MatMenuModule,
    NgxSpinnerModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatRippleModule,
    MatTooltipModule,
    SharedModule
  ],
  entryComponents: [
    SaveComponent
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {} // Add any data you wish to test if it is passed/used correctly
    }
  ],
  exports: [AsideComponent, HeaderComponent, SaveComponent]
})
export class LayoutModule { }
