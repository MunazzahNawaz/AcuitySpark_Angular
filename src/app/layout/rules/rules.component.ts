import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/customer/services/store.service';
import { CustomerService } from 'src/app/customer/services/customer.service';
import { RuleStatus, RuleType, Rule, RuleColumn, MatchType } from 'src/app/customer/models/rule';
import { MatDialog } from '@angular/material/dialog';
import { RuleService } from 'src/app/customer/services/rule.service';
import { AuthService } from 'src/app/auth/services/auth.service';
declare var toastr;
@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})

export class RulesComponent implements OnInit {
  ruleCount: Array<any> = [];
  rules: Array<Rule> = [];
  ruleStatus = RuleStatus;
  @Output() close = new EventEmitter<any>();
  @Output() ruleCountChange = new EventEmitter<any>();
  @Output() ruleSetChange = new EventEmitter<any>();
  // sendBackFlag = false;
  ruleType = RuleType;
  currentRuleSetId = 0;
  isSchedule = false;
  allRuleSets = [];
  selectedRuleSet;
  allCustomerFields = [];
  currentRules: Array<any> = [];
  constructor(
    private storeService: StoreService,
    private ruleService: RuleService,
    private customerService: CustomerService,
    private router: Router,
    public dialog: MatDialog,
    protected apiRule: RuleService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getIsLoginReady().subscribe(isLoggedIn => {
      if (isLoggedIn != null && isLoggedIn == true) {
        this.loadData();
      }
    });
    // this.sendBackFlag = Boolean(localStorage.getItem('sendBackFlag'));

  }
  loadData() {
    this.storeService.getUserSettings().subscribe(x => {
      if (x && x != null) {
        this.allCustomerFields = x;
      }
    });
    this.storeService.getRuleChanged().subscribe(flag => {
      console.log('in rules pan getRule changed', flag);
      this.rules = [];
      this.rules = JSON.parse(localStorage.getItem('rules'));
      this.ruleCount = JSON.parse(localStorage.getItem('rulesCount'));
      if (this.rules) {
        const filteredRules = this.rules.filter(
          r => r.ruleTypeId != RuleType.deduplication &&
            r.ruleTypeId != RuleType.candidateMerge &&
            r.ruleTypeId != RuleType.recordLinkage);
        this.ruleCountChange.emit(filteredRules.length);
        this.currentRules = filteredRules;
        this.rules.forEach(rule => {
          this.getExpectedCount(rule);
        });
      } else {
        this.ruleCountChange.emit(0);
      }
    });
    this.storeService.getCustomerArchivedRules().subscribe(ruleSetLst => {
      this.allRuleSets = ruleSetLst;
      console.log('all rule sets', this.allRuleSets);
      if (this.allRuleSets != null) {
        let defaultRuleSet = this.allRuleSets.filter(x => x.ruleSet.isDefault == true);
        if (this.selectedRuleSet && this.selectedRuleSet.ruleSetId > 0) {
          const tempRuleSet = this.allRuleSets.filter(x => x.ruleSet.ruleSetId == this.selectedRuleSet.ruleSetId);
          if (tempRuleSet && tempRuleSet.length > 0) {
            defaultRuleSet = tempRuleSet;
          }
        }
        this.selectedRuleSet = (defaultRuleSet && defaultRuleSet.length > 0) ? defaultRuleSet[0].ruleSet : null;
        this.onRuleSetChange();
      }
    });
  }
  isDataCleansingRules(ruleType) {
    if ((ruleType >= 1 && ruleType <= 8) || ruleType == 10 || ruleType == 17 || ruleType == 20) {
      return true;
    }
    return false;
  }
  isDedupeRule(ruleType) {
    if (ruleType == 15 || ruleType == 12 || ruleType == 18) {
      return true;
    }
    return false;
  }
  onCancelClick() {
    this.loadData();
  }

  onRuleSetChange() {
    this.currentRules = [];
    this.rules = [];
    if (this.selectedRuleSet) {

      // this.rules = this.selectedRuleSet.rules;
      this.rules = this.selectedRuleSet.rules.filter(x => this.isDataCleansingRules(x.ruleTypeId) || this.isDedupeRule(x.ruleTypeId));

     // console.log('filtered rules', this.selectedRuleSet.rules.filter(x => this.isDataCleansingRules(x.ruleTypeId) || this.isDedupeRule(x.ruleTypeId)));

     // console.log('current rules', this.rules);
      this.currentRules = this.rules;
      this.rules.forEach(rule => {
        this.getExpectedCount(rule);
      });
      // console.log('rules', this.rules);
      localStorage.setItem('selectedRuleSet', JSON.stringify(this.selectedRuleSet));
      localStorage.setItem('rules', JSON.stringify(this.rules));
      this.storeService.setRuleChanged(true);
      this.ruleSetChange.emit(this.selectedRuleSet);
    }
  }
  // onSendBackFlagChange() {
  //   localStorage.setItem('sendBackFlag', this.sendBackFlag.toString());
  // }
  getExpectedCount(rule) {
    // console.log('in get expected count');
    // console.log('rule', rule);
    let count = 0;
    if (rule) {
      if (this.isDataCleansingRules(rule.ruleTypeId)) {
        this.customerService.getRuleCount(rule.ruleColumn, rule.ruleTypeId).subscribe(resp => {
          count = resp.countRowsEffected;
          rule.count = count.toLocaleString('en-US');
        });
      } else {
        if (rule.ruleTypeId == RuleType.UserDedupe) {
          let dedupeCount = 0;
          let ruleColumns = [];
          if (rule.ruleColumn && rule.ruleColumn.length > 0) {
            ruleColumns = rule.ruleColumn[0].columnDbName.split(',');
            ruleColumns.forEach(col => {
              const currentField = this.allCustomerFields.find(x => x.columnDbName == col);
              const colName = (currentField ? currentField.columnDbName : (col == 'Name' ? 'firstName' : col));
              const cols = [{
                columnDbName: colName,
                columnValue: '',
                ignoreCase: true,
                matchEmpty: true
              }];
              this.customerService.getRuleCount(cols, RuleType.deduplication).subscribe(resp => {
                count = resp.countRowsEffected;
                if (count > dedupeCount) {
                  dedupeCount = count;
                  rule.count = count.toLocaleString('en-US');
                }
              });
            });
          }
        }
      }
    }

  }

  getColDisplayName(col) {
    let colDisplayName = col;
    if (this.allCustomerFields) {
      const currentField = this.allCustomerFields.find(x => x.columnDbName == col);
      colDisplayName = (currentField ? currentField.columnDisplayName : col);
      return colDisplayName;
    }
    return colDisplayName;
  }
  closeRules() {
    this.close.emit();
  }
  getExpectedText(status) {
    if (status == RuleStatus.Applied) {
      return 'Actual';
    } else {
      return 'Expected';
    }
  }
  onRemoveRule(rule) {
    //let existingRule = this.currentRules.find(x => x.ruleId == rule.ruleId);
    const index = this.currentRules.indexOf(rule);
    // console.log('in rule pan remove', index);
    // console.log('in rule pan remove rule', rule);
    // console.log('in rule pan existingRule', existingRule);
    if (index >= 0) {
      this.currentRules.splice(index, 1);
      localStorage.setItem('rules', JSON.stringify(this.currentRules));
      this.storeService.setRuleChanged(true);
    }
  }
  ResetRules() {
    if (this.currentRules.length == 0) {
      toastr.info('No rules available to reset');
      return;
    }
    this.storeService.setResetRules(true);
    this.storeService.resetCustomerRules();
    localStorage.setItem('rulesCount', JSON.stringify([]));
    // localStorage.setItem('rules', JSON.stringify([]));
    this.ruleCount = [];
    this.currentRules = [];
    this.rules = [];
    this.ruleCountChange.emit(0);

    localStorage.setItem('rules', JSON.stringify(this.currentRules));
    this.storeService.setRuleChanged(true);
  }
  finalizeDedupeRules(dedupeRule) {
   // console.log('dedupe RULE OLD', dedupeRule);
    let cols = dedupeRule.ruleColumn[0].columnDbName.split(',');
    console.log('cols', cols);
    const dedupeColumns: Array<RuleColumn> = [];
    cols.forEach(col => {
      dedupeColumns.push({
        columnDbName: col,
        columnDisplayName: this.getColDisplayName(col),
        columnValue: dedupeRule.ruleColumn[0].columnValue,
        ignoreCase: dedupeRule.ruleColumn[0].ignoreCase,
        matchType: dedupeRule.ruleColumn[0].matchType,
        matchonEmpty: dedupeRule.ruleColumn[0].matchOnEmpty,
        alternateColumnName: '',
        ignoreValues: ''
      });
    });
    const orderBy = dedupeRule.goldenRuleDefaultFieldValue;

    const currentRule = {
      ruleTypeId: RuleType.deduplication,
      ruleColumn: dedupeColumns,
      ruleDescription: 'Deduplication Rule',
      status: RuleStatus.Pending,
      isSelected: true,
      sortColumn: '',
      goldenRuleCriteria: dedupeRule.goldenRuleCriteria,
      goldenRuleDefaultFieldValue: orderBy,
      goldenRuleDefaultIndValue: '',
      replaceWith: '',
      replaceStr: ''
    };
    return currentRule;
  }
  saveRule() {
    // const newRuleSet = {
    //   ruleName: ruleName,
    //   rules: this.rules
    // };
    //  this.archivedRules.push(newRuleSet);
    const dedupeRuleOld = this.rules.filter(x => x.ruleTypeId == 12);
   // console.log('dedupeRuleOld', dedupeRuleOld);
    const rulesToSave = this.rules.filter(x => x.ruleTypeId != 15 && x.ruleTypeId != 18 && x.ruleTypeId != 12);
    if (dedupeRuleOld && dedupeRuleOld.length > 0) {
      const dedupeRule = this.finalizeDedupeRules(dedupeRuleOld[0]);
    //  console.log('dedupeRule', dedupeRule);
      rulesToSave.push(dedupeRule);
    }
    this.selectedRuleSet.rules = rulesToSave;

  //  console.log('rules to save', rulesToSave);
    this.ruleService.saveRuleSet(this.selectedRuleSet).subscribe(x => {
      toastr.success('Rules has been saved.');
      this.currentRuleSetId = x.ruleSetId <= 0 ? this.selectedRuleSet.ruleSetId : x.ruleSetId;
      if (this.isSchedule) {
        this.router.navigate(['/customer/schedule'], { queryParams: { ruleId: this.currentRuleSetId } });
      }
      this.storeService.refreshCustomerArchivedRules();
    });
  }
  onRuleSelect(rule, isSelected) {
    //   console.log('in onRuleSelected');
    rule.isSelected = isSelected;
    rule.status = isSelected ? RuleStatus.Pending : rule.status;
  }


  onSaveClick() {
    this.saveRule();
    // const dialogRef = this.dialog.open(SaveComponent, {
    //   width: '300px',
    //   data: { saveRuleName: '' },
    //   position: { top: '5%', left: '40%' }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   // this.saveRuleName = result;
    //   if (result.saveRuleName != '') {
    //     this.saveRule(result.saveRuleName);
    //   }
    //   else {
    //     toastr.info('Rule Name field is blank');
    //   }

    // });
  }
  onScheduleClick() {
    if (this.rules.length == 0) {
      toastr.info('No rules to schedule');
      return;
    }
    this.isSchedule = true;
    this.onSaveClick();
  }
}
