import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../services/header.service';
import { StoreService } from 'src/app/customer/services/store.service';
import { RuleService } from 'src/app/customer/services/rule.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MatDialog } from '@angular/material';
import { ResetComponent } from '../../shared/reset/reset.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showRules = false;
  showMore = false;
  rulesCount = 0;
  archivedRules$;
  archivedRulesCount = 0;
  // allRules = [];
  userName;
  userEmail;

  constructor(
    private authService: AuthService,
    public headerService: HeaderService,
    private storeService: StoreService,
    protected ruleService: RuleService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.authService.getIsLoginReady().subscribe(isLoggedIn => {
      if (isLoggedIn != null && isLoggedIn == true) {
        this.setVariables();
      }
    });
    // if (this.authService.isLoggedIn()) {
    // } else {
    //   setTimeout(() => {
    //     this.setVariables();
    //   }, 6000);
    // }

  }
  setVariables() {
    this.archivedRules$ = this.storeService.getCustomerArchivedRules();
    this.archivedRules$.subscribe(rules => {
      if (rules) {
        this.archivedRulesCount = rules.length;
      }
    });
    this.userName = this.authService.getUserName();
    this.userEmail = this.authService.getEmail();
  }
  onLogoutClick() {
    sessionStorage.clear();
    this.authService.logOut();
  }
  ruleCountChange(count) {
    this.rulesCount = count;
    // this.archivedRules$ = this.ruleService.getAllRuleSet();
  }
  archiveRuleClick(rule) {
    // this.storeService.setRuleChanged(true);
  }
  enableSchedule(rules) {
    this.ruleService.enableRuleSchedule(rules.ruleScheduleId, !rules.isEnabled).subscribe(x => {
      this.storeService.refreshCustomerArchivedRules();
    });
  }
  onResetClick(): void {
    const dialogRef = this.dialog.open(ResetComponent, {
      width: '450px',
    });
  }
}
