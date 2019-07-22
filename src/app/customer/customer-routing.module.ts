import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterComponent } from './master/master.component';
import { ImportComponent } from './import/import.component';
import { MapComponent } from './map/map.component';
import { HeaderComponent } from '../layout/header/header.component';
// import { GoldenCustomerComponent } from './golden-customer/golden-customer.component';
import { GoldenCustomerFinalComponent } from './golden-customer-final/golden-customer-final.component';
// import { ManualReviewComponent } from './manual-review/manual-review.component';
// import { ManualReviewFinalComponent } from './manual-review-final/manual-review-final.component';
import { GoldenCustFullComponent } from './golden-cust-full/golden-cust-full.component';
import { CustomerFinalComponent } from './customer-final/customer-final.component';
import { ManualCustomerComponent } from './manual-customer/manual-customer.component';

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      {
        path: 'data',
        component: MasterComponent
      },
      {
        path: 'import',
        component: ImportComponent
      },
      {
        path: 'map',
        component: MapComponent
      },
      {
        path: 'goldenFull',
        component: GoldenCustFullComponent
      },
      {
        path: 'manualCust',
        component: ManualCustomerComponent
      },
      {
        path: 'goldenfinal',
        component: GoldenCustomerFinalComponent
      },
      // {
      //   path: 'manual',
      //   component: ManualReviewComponent
      // },
      // {
      //   path: 'manualFinal',
      //   component: ManualReviewFinalComponent
      // },
      {
        path: 'final',
        component: CustomerFinalComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule {}
