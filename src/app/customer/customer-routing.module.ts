import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterComponent } from './master/master.component';
import { HeaderComponent } from '../layout/header/header.component';
import { CustomerFinalComponent } from './customer-final/customer-final.component';
// import { CustomerTransactionComponent } from './customer-transaction/customer-transaction.component';
// import { SegmentationComponent } from './segmentation/segmentation.component';
import { ManualMergeComponent } from './manual-merge/manual-merge.component';
import { RuleScheduleComponent } from 'src/app/customer/ruleSchedule/ruleSchedule.component';
import { JobStatusComponent } from './jobStatus/jobStatus.component';
import { ExportComponent } from './export/export.component';
import { AuthGuard } from '../auth/services/auth-guard.service';
import { RuleEngineComponent } from './rule-engine/rule-engine.component';
const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      {
        path: 'data',
        component: MasterComponent,
        // canActivate: [AuthenticationGuard]
        canActivate: [AuthGuard]
      },

      {
        path: 'manualMerge',
        component: ManualMergeComponent,
        // canActivate: [AuthenticationGuard]
        canActivate: [AuthGuard]
      },

      // {
      //   path: 'cs',
      //   component: CustomerTransactionComponent,
      //   // canActivate: [AuthenticationGuard]
      //   canActivate: [AuthGuard]
      // },
      {
        path: 'schedule',
        component: RuleScheduleComponent,
        // canActivate: [AuthenticationGuard]
        canActivate: [AuthGuard],
        data: { roles: ['Admin'] }
      },

      {
        path: 'consolidatedData',
        component: CustomerFinalComponent,
        // canActivate: [AuthenticationGuard]
        canActivate: [AuthGuard]
      },
      // {
      //   path: 'segmentation',
      //   component: SegmentationComponent,
      //   // canActivate: [AuthenticationGuard]
      //   canActivate: [AuthGuard]
      // },

      {
        path: 'ruleEngine',
        component: RuleEngineComponent,
        // canActivate: [AuthenticationGuard]
        canActivate: [AuthGuard],
        // data: { roles: ['Admin'] }
      },
      {
        path: 'jobStatus',
        component: JobStatusComponent,
        // canActivate: [AuthenticationGuard]
        canActivate: [AuthGuard],
        data: { roles: ['Admin'] }
      },
      {
        path: 'export',
        component: ExportComponent,
        // canActivate: [AuthenticationGuard]
        canActivate: [AuthGuard],
        data: { roles: ['Admin'] }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
