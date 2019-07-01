import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterComponent } from './master/master.component';
import { ImportComponent } from './import/import.component';
import { MapComponent } from './map/map.component';
import { HeaderComponent } from '../layout/header/header.component';
import { GoldenCustomerComponent } from './golden-customer/golden-customer.component';
import { GoldenCustomerFinalComponent } from './golden-customer-final/golden-customer-final.component';
import { ManualReviewComponent } from './manual-review/manual-review.component';

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
        path: 'goldenCust',
        component: GoldenCustomerComponent
      },
      {
        path: 'goldenfinal',
        component: GoldenCustomerFinalComponent
      },
      {
        path: 'manual',
        component: ManualReviewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule {}
