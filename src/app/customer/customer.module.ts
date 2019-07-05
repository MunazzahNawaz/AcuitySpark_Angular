import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { NgxSpinnerModule } from 'ngx-spinner';

import { CustomerRoutingModule } from './customer-routing.module';
import { MasterComponent } from './master/master.component';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { TranslateModule } from '@ngx-translate/core';
import { ImportComponent } from './import/import.component';
import { MapComponent } from './map/map.component';
import { UploadComponent } from './upload/upload.component';
import { LayoutModule } from '../layout/layout.module';
import { DeduplicateComponent } from './deduplicate/deduplicate.component';
import { GoldenCustomerComponent } from './golden-customer/golden-customer.component';
import { SelectGoldenCustComponent } from './select-golden-cust/select-golden-cust.component';
import { GridComponent } from './grid/grid.component';
import { GoldenCustomerFinalComponent } from './golden-customer-final/golden-customer-final.component';
import { GoldenRowDetailViewComponent } from './golden-row-detail-view/golden-row-detail-view.component';
import { GoldRowDetailPreloadComponent } from './gold-row-detail-preload/gold-row-detail-preload.component';
import { ManualReviewComponent } from './manual-review/manual-review.component';
import { ManualReviewFinalComponent } from './manual-review-final/manual-review-final.component';
import { PagerComponent } from './pager/pager.component';

@NgModule({
  declarations: [
    MasterComponent,
    ImportComponent,
    MapComponent,
    UploadComponent,
    DeduplicateComponent,
    GoldenCustomerComponent,
    SelectGoldenCustComponent,
    GridComponent,
    GoldenCustomerFinalComponent,
    GoldenRowDetailViewComponent,
    GoldRowDetailPreloadComponent,
    ManualReviewComponent,
    ManualReviewFinalComponent,
    PagerComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CustomerRoutingModule,
    LayoutModule,
    AngularSlickgridModule.forRoot(),
    TranslateModule.forRoot(),
    NgxSpinnerModule,
    LoadingBarHttpClientModule
  ],
  entryComponents: [
    GoldenRowDetailViewComponent,
    GoldRowDetailPreloadComponent
  ]
})
export class CustomerModule { }
