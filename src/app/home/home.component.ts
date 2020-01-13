import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderService } from '../layout/services/header.service';
import { HomeService } from '../shared/services/home.service';
import { AuthService } from '../auth/services/auth.service';
import { ResetComponent } from '../shared/reset/reset.component';
import { MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  successfulJobsCount = 0;
  failJobsCount = 0;
  InProgressCount = 0;
  totalRecordsCount = 0;
  duplicateRecordCount = 0;
  masterRecordsCount = 0;
  candidateMergeRecordsCount = 0;
  cleansingRulesCount = 0;
  deduplicationRulesCount = 0;
  scheduledRulesCount = 1;
  allCountsSub;
  waitForLogin = true;
  dedupeField1;
  dedupeField2;
  dedupeField1Count;
  dedupeField2Count;

  constructor(
    private headerService: HeaderService,
    private homeService: HomeService,
    private authService: AuthService,
    public dialog: MatDialog,
    protected spinner: NgxSpinnerService
  ) {
    this.spinner.show();
  }

  ngOnInit() {
    this.headerService.setTitle('Home');

    this.authService.getIsLoginReady().subscribe(isLoggedIn => {
      if (isLoggedIn != null && isLoggedIn == true) {
        this.getCounts();
        this.waitForLogin = false;
        this.spinner.hide();
      }
    });
  }
  getCounts() {
    this.allCountsSub = this.homeService.getAllCounts().subscribe(resp => {

      this.successfulJobsCount = resp.successfulJobsCount;
      this.failJobsCount = resp.failedJobsCount;
      this.InProgressCount = resp.inProgressJobsCount;
      this.totalRecordsCount = resp.totalRecordCount;
      this.masterRecordsCount = resp.masterRecordCount;
      this.candidateMergeRecordsCount = resp.candidateMergeCount;
      this.cleansingRulesCount = resp.cleansingRulesCount;
      this.deduplicationRulesCount = resp.dedupeRulesCount;
      this.dedupeField1 = resp.dedupeField1;
      this.dedupeField2 = resp.dedupeField2;
      if (resp.dedupeField1 && resp.dedupeField1.toLowerCase() == 'email') {
        this.dedupeField1Count = resp.emailCount;
      } else if (resp.dedupeField1 && resp.dedupeField1.toLowerCase() == 'phone') {
        this.dedupeField1Count = resp.phoneCount;
      } else if (resp.dedupeField1 && resp.dedupeField1.toLowerCase() == 'address') {
        this.dedupeField1Count = resp.addressCount;
      } else if (resp.dedupeField1 && resp.dedupeField1.toLowerCase() == 'name') {
        this.dedupeField1Count = resp.nameCount;
      } else {
        this.dedupeField1Count = resp.nameCount;
      }

      if (resp.dedupeField2 && resp.dedupeField2.toLowerCase() == 'email') {
        this.dedupeField2Count = resp.emailCount;
      } else if (resp.dedupeField2 && resp.dedupeField2.toLowerCase() == 'phone') {
        this.dedupeField2Count = resp.phoneCount;
      } else if (resp.dedupeField2 && resp.dedupeField2.toLowerCase() == 'address') {
        this.dedupeField2Count = resp.addressCount;
      } else if (resp.dedupeField2 && resp.dedupeField2.toLowerCase() == 'name') {
        this.dedupeField2Count = resp.nameCount;
      } else {
        this.dedupeField2Count = resp.addressCount;
      }
    });
  }
  // getCounts_old() {
  //   this.allCountsSub = this.homeService.getJobStatusCount().subscribe(resp => {
  //     this.jobStatusCount = resp.countOfJobStatus;
  //     if (this.jobStatusCount && this.jobStatusCount.length > 0) {
  //       this.totalCount = 0;
  //       this.jobStatusCount.forEach(x => (this.totalCount += x.count));
  //     }
  //   });

  //   this.totalRecSub = this.rowCountService.getTotalRecordsCount().subscribe(resp => {
  //     this.totalRecordsCount = resp.countRowsEffected;
  //   });
  //   /////////////////////////////////////
  //   // this.emailCountSub = this.rowCountService.getDuplicateRecordsCount('email').subscribe(resp => {
  //   //   this.emailRecordCount = resp.countRowsEffected;
  //   // });
  //   // this.phoneCountSub = this.rowCountService.getDuplicateRecordsCount('phone').subscribe(resp => {
  //   //   this.phoneRecordCount = resp.countRowsEffected;
  //   // });

  //   // this.linkedRecSub = this.rowCountService
  //   //   .getDuplicateRecordsCount('masterID')
  //   //   .subscribe(resp => {
  //   //     this.linkedRecordCount = resp.countRowsEffected;
  //   //   });

  //   this.masterCountSub = this.rowCountService.getMasterRecordsCount().subscribe(resp => {
  //     this.masterRecordsCount = resp.countRowsEffected;
  //   });

  //   this.candCountSub = this.rowCountService.getCandidateMergeRecordsCount().subscribe(resp => {
  //     this.candidateMergeRecordsCount = resp.count;
  //   });

  //   this.archivedRules$ = this.storeService.getCustomerArchivedRules();
  //   this.archRuleSub = this.archivedRules$.subscribe(rules => {
  //     if (rules) {
  //       const scheduledRules = rules.filter(r => r.ruleScheduleId > 0);
  //       this.scheduledRulesCount = scheduledRules.length;
  //       rules.forEach(rule => {
  //         if (rule.ruleSet.isDefault && rule.ruleSet.rules) {
  //           const recordLinkageRule = rule.ruleSet.rules.filter(r => r.ruleTypeId == RuleType.recordLinkage);
  //           if (recordLinkageRule && recordLinkageRule.length > 0) {
  //             const recoredLinkageColumnNames = recordLinkageRule[0].ruleColumn[0].columnDbName.split(',');
  //             this.deduplicationRulesCount = recoredLinkageColumnNames.length;
  //             this.topRecordLinkageColumns = [];
  //             for (let i = 0; i < 2; i++) {
  //               // const filterField = this.allCustomerFields.filter(x => x.columnDbName == recoredLinkageColumnNames[i]);
  //               //  let displayName = recoredLinkageColumnNames[i];
  //               // if (filterField) {
  //               //   displayName = filterField[0].columnDisplayName;
  //               // }

  //               this.topRecordLinkageColumns[i] = {
  //                 fieldName: recoredLinkageColumnNames[i],
  //                 fieldDisplayName: this.getDisplayName(recoredLinkageColumnNames[i]),
  //                 count: 0
  //               };
  //             }
  //           }
  //           this.defaultRuleSetRulesCount = rule.ruleSet.rules.length;
  //           const cleansingRules = rule.ruleSet.rules.filter(r => this.getCleansingRuleTypes().includes(r.ruleTypeId));
  //           this.cleansingRulesCount = cleansingRules.length;
  //           this.defaultRuleSetRulesCount = this.cleansingRulesCount + this.deduplicationRulesCount;
  //           this.topRecordLinkageColumns.forEach(item => {
  //             this.rowCountService.getDuplicateRecordsCount(item.fieldName).subscribe(resp => {
  //               console.log('in get dedupe count for ', item.fieldName, ' => count =', resp);
  //               item.count = resp.countRowsEffected;
  //             });
  //             item.fieldDisplayName = this.getDisplayName(item.fieldName);
  //           });
  //         }
  //       });
  //     }
  //   });
  // }
  getDisplayName(fieldName) {
    return (fieldName != null && fieldName != '') ? (fieldName.trim().charAt(0).toUpperCase() + fieldName.substr(1).toLowerCase()) : fieldName;
  }
  getTotalDedupeCount() {
    let count = 0;
    // if (this.topRecordLinkageColumns && this.topRecordLinkageColumns.length >= 2) {
    //   if (this.topRecordLinkageColumns[0].count > this.topRecordLinkageColumns[1].count) {
    //     count = this.topRecordLinkageColumns[0].count;
    //   }
    //   count = this.topRecordLinkageColumns[1].count;
    // }
    if (this.dedupeField1Count > this.dedupeField2Count) {
      count = this.dedupeField1Count;
    } else {
      count = this.dedupeField2Count;
    }
    return count;
  }

  // getCleansingRuleTypes() {
  //   const ruleTypes = [];
  //   for (const key of Object.keys(DataCleansingRuleTypes)) {
  //     if (Number.isNaN(parseInt(key, 10))) {
  //       // key of enum cannot be number
  //       ruleTypes.push(DataCleansingRuleTypes[key]);
  //     }
  //   }
  //   return ruleTypes.sort().reverse();
  // }

  ngOnDestroy(): void {
    if (this.allCountsSub) {
      this.allCountsSub.unsubscribe();
    }
    // if (this.emailCountSub) {
    //   this.emailCountSub.unsubscribe();
    // }
    // if (this.phoneCountSub) {
    //   this.phoneCountSub.unsubscribe();
    // }
    // // if (this.linkedRecSub) {
    // //   this.linkedRecSub.unsubscribe();
    // // }
    // if (this.masterCountSub) {
    //   this.masterCountSub.unsubscribe();
    // }
    // if (this.candCountSub) {
    //   this.candCountSub.unsubscribe();
    // }
    // if (this.archRuleSub) {
    //   this.archRuleSub.unsubscribe();
    // }

  }
  onResetClick(): void {
    const dialogRef = this.dialog.open(ResetComponent, {
      width: '450px',
    });
  }
}
