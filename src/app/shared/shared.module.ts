import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter/filter.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ScheduleComponent } from './schedule/schedule.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { HasRoleDirective } from '../directives/has-role.directive';
import { ResetComponent } from './reset/reset.component';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [
    FilterComponent,
    ScheduleComponent,
    HasRoleDirective,
    ResetComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    PerfectScrollbarModule,
    MatExpansionModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatCardModule,
    MatDialogModule
  ],
  exports: [
    FilterComponent,
    ScheduleComponent,
    HasRoleDirective,
    ResetComponent
  ]
})
export class SharedModule { }
