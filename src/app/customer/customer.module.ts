import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { NgxSpinnerModule } from 'ngx-spinner';

import { CustomerRoutingModule } from './customer-routing.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// import { AngularSlickgridModule } from 'angular-slickgrid';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReplaceComponent } from './replace/replace.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


import { LayoutModule } from '../layout/layout.module';
import { SharedModule } from '../shared/shared.module';

import { MasterComponent } from './master/master.component';
import { PagerComponent } from './pager/pager.component';
import { CustomerFinalComponent } from './customer-final/customer-final.component';
import { ManualMergeComponent } from './manual-merge/manual-merge.component';
import { RuleScheduleComponent } from './ruleSchedule/ruleSchedule.component';
import { JobStatusComponent } from './jobStatus/jobStatus.component';
import { ExportComponent } from './export/export.component';
import { WarningComponent } from './warning/warning.component';
import { RuleEngineComponent } from './rule-engine/rule-engine.component';
import { AddressStandardComponent } from './address-standard/address-standard.component';
import { NameStandardComponent } from './name-standard/name-standard.component';



@NgModule({
    declarations: [
        MasterComponent,
        PagerComponent,
        CustomerFinalComponent,
        ReplaceComponent,
        RuleEngineComponent,
        ManualMergeComponent,
        RuleScheduleComponent,
        JobStatusComponent,
        ExportComponent,
        WarningComponent,
        AddressStandardComponent,
        NameStandardComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        CustomerRoutingModule,
        LayoutModule,
        TranslateModule.forRoot(),
        NgxSpinnerModule,
        LoadingBarHttpClientModule,
        PerfectScrollbarModule,
        NgxPaginationModule,
        MatDialogModule,
        MatSelectModule,
        MatInputModule,
        MatChipsModule,
        MatIconModule,
        MatProgressBarModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTabsModule,
        MatTableModule,
        MatRadioModule,
        MatButtonModule,
        MatExpansionModule,
        MatCardModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        MatTooltipModule,
        SharedModule,
        MatSlideToggleModule
    ],
    entryComponents: [
        ReplaceComponent,
        WarningComponent,
        AddressStandardComponent,
        NameStandardComponent
    ],
    providers: [
        { provide: MatDialogRef, useValue: {} },
        {
            provide: MAT_DIALOG_DATA,
            useValue: {} // Add any data you wish to test if it is passed/used correctly
        }
    ]
})
export class CustomerModule { }
