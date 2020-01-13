import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerService } from './customer.service';
import { Rule } from '../models/rule';
// import { AppTransactionConfig, CustomerTransactionResponse } from '../models/customer';
import { RuleService } from './rule.service';
import { User } from 'src/app/auth/models/user';
import { UserSettingService } from 'src/app/layout/services/user-setting.service';
import { ICountKeys, IKeys } from 'src/app/shared/modals/countKeys';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private customerFile$ = new BehaviorSubject<any>(null);
  private customerFieldMappings$ = new BehaviorSubject<any>(null);
  private customerFinalData$ = new BehaviorSubject<any>(null);
//  private customerFinalDataFull$ = new BehaviorSubject<any>(null);
  private customerTransaction$ = new BehaviorSubject<any>(null);
  private customerRules$ = new BehaviorSubject<any>([]);
  private customerArchivedRules$ = new BehaviorSubject<any>(null);
  private customerManualRecordData$ = new BehaviorSubject<any>(null);
  private goldenCustomerField$ = new BehaviorSubject<any>(null);
  private currentFileUrl$ = new BehaviorSubject<any>(null);
  private ruleCount$ = new BehaviorSubject<any>(null);
  private customerRules: Array<Rule> = [];
  private userSettings$ = new BehaviorSubject<any>(null);
  private fieldCountKeys$ = new BehaviorSubject<ICountKeys>(null);
  private user$ = new BehaviorSubject<User>(null);
  ruleChanged$ = new BehaviorSubject(true);
  resetRules$ = new BehaviorSubject(false);
  sendBackToSourceFlag$ = new BehaviorSubject(false);

  constructor(
    private userSettingService: UserSettingService,
    private customerService: CustomerService,
    private ruleService: RuleService) {
      this.userSettings$ = new BehaviorSubject<any>(null);
  }

  setUser(user) {
    this.user$.next(user);
  }
  getUser(): Observable<any> {
    return this.user$.asObservable();
  }
  refreshUserSettings() {
    const userId = localStorage.getItem('userId');
    if (userId && userId != null) {
      this.userSettingService.getUserSettings(userId).subscribe(x => {
        this.userSettings$.next(x.userSettings);
      });
    }
  }
  setUserSettings(userSettingsData) {
    this.userSettings$.next(userSettingsData);
  }
  getUserSettings(): Observable<any> {
    if (this.userSettings$.getValue() == null) {
      const userId = localStorage.getItem('userId') ? localStorage.getItem('userId') : '';
      console.log('in get user setting from store, userId =', userId);
      if (userId && userId != null) {
        this.userSettingService.getUserSettings(userId).subscribe(x => {
          this.userSettings$.next(x.userSettings);
        });
      }
    }
    return this.userSettings$.asObservable();
  }
  addFieldCountKeys(countKeys: IKeys, fieldName) {
    let currentFieldCountKeys: { [id: string]: IKeys; } = {};

    currentFieldCountKeys = this.fieldCountKeys$.getValue();
    if (currentFieldCountKeys == null) {
      currentFieldCountKeys = {};
    }
    currentFieldCountKeys[fieldName] = countKeys;
    this.fieldCountKeys$.next(currentFieldCountKeys);
  }
  getFieldCountKeys(): Observable<any> {
    return this.fieldCountKeys$.asObservable();
  }

  setSendBackToSourceFlag(flag) {
    this.sendBackToSourceFlag$.next(flag);
  }
  getSendBackToSourceFlag(): Observable<any> {
    return this.sendBackToSourceFlag$.asObservable();
  }
  setResetRules(flag) {
    this.resetRules$.next(flag);
  }
  getResetRules(): Observable<any> {
    return this.resetRules$.asObservable();
  }
  setRuleChanged(flag) {
    this.ruleChanged$.next(flag);
  }
  getRuleChanged(): Observable<any> {
    return this.ruleChanged$.asObservable();
  }

  setCurrentFileUrl(url) {
    this.currentFileUrl$.next(url);
  }
  getCurrentFileUrl(): Observable<any> {
    return this.currentFileUrl$.asObservable();
  }
  setCustomerFile(file) {
    this.customerFile$.next(file);
  }
  getCustomerFile(): Observable<any> {
    return this.customerFile$.asObservable();
  }

  setRuleCount(rulesCount) {
    this.ruleCount$.next(rulesCount);
  }
  getRuleCount(): Observable<any> {
    return this.ruleCount$.asObservable();
  }
  refreshCustomerRules(rules) {
    this.customerRules = rules;
    this.customerRules$.next(this.customerRules);
  }
  setCustomerRules(rule) {
    if (this.customerRules && this.customerRules.length >= 0) {
      this.customerRules.push(rule);
    }
    this.customerRules$.next(this.customerRules);
  }
  resetCustomerRules() {
    this.customerRules = [];
    this.customerRules$.next(this.customerRules);
  }
  removeRule(rule) {
    if (this.customerRules && this.customerRules.length >= 0) {
      const index = this.customerRules.indexOf(rule);
      if (index >= 0) {
        this.customerRules.splice(index, 1);
        this.customerRules$.next(this.customerRules);
      }
    }
  }
  getCustomerRules(): Observable<any> {
    return this.customerRules$.asObservable();
  }
  setCustomerArchivedRules(rules) {
    this.customerArchivedRules$.next(rules);
  }
  getCustomerArchivedRules(): Observable<any> {
    if (!this.customerArchivedRules$ || this.customerArchivedRules$.getValue() == null) {
      this.refreshCustomerArchivedRules();
    }
    return this.customerArchivedRules$.asObservable();
  }
  setCustomerFieldMappings(mappings) {
    this.customerFieldMappings$.next(mappings);
  }
  getCustomerFieldMappings(): Observable<any> {
    return this.customerFieldMappings$.asObservable();
  }
  setCustomerManualRecordData(mappings) {
    this.customerManualRecordData$.next(mappings);
  }
  getCustomerManualRecordData(): Observable<any> {
    return this.customerManualRecordData$.asObservable();
  }
  setCustomerGoldenRecordData(val) {
    this.goldenCustomerField$.next(val);
  }
  getCustomerGoldenRecordData(): Observable<any> {
    return this.goldenCustomerField$.asObservable();
  }
  resetCustomerFinalData() {
    this.customerFinalData$ = new BehaviorSubject<any>(null);
  }
  refreshCustomerArchivedRules() {
    this.ruleService.getAllRuleSet().subscribe(rules => {
      this.customerArchivedRules$.next(rules);
    });
  }
  refreshCustomerFinalData() {
    this.customerService.getCustomerData([]).subscribe(c => {
      this.customerFinalData$.next(c.customer);
    });

    // TODO: Temporary code
    // const dataSet = [];
    // this.dataSet = [];
    // let id = 1;
    // data.forEach(d => {
    //   d.id = id;
    //   id++;
    //   this.dataSet.push(d);
    // });
    // end temporary code
    // data.map(x => x.id = x.CustomerNo);
    // this.storeService.setcustomerFinalData(dataSet);

    // this.customerFinalData$.next(data);
  }
  getcustomerFinalData(filters): Observable<any> {
    if (this.customerFinalData$.getValue() == null) {
      this.customerService.getCustomerData(filters).subscribe(c => {
        this.customerFinalData$.next(c);
      });
    }
    return this.customerFinalData$.asObservable();
  }
  // getcustomerFinalDataFull(filters): Observable<any> {
  //   if (this.customerFinalDataFull$.getValue() == null) {
  //     this.customerService.getCustomerDataFull(filters).subscribe(c => {
  //       this.customerFinalDataFull$.next(c);
  //     });
  //   }
  //   return this.customerFinalData$.asObservable();
  // }
  // getcustomerTransactionData(appTransactionConfig: AppTransactionConfig, isFiltered): Observable<any> {
  //   if (this.customerTransaction$.getValue() == null) {
  //     this.customerService.getCustomerTransaction(appTransactionConfig, isFiltered).subscribe(c => {
  //       const customerTrans: CustomerTransactionResponse = c;
  //       this.customerTransaction$.next(customerTrans);
  //     });
  //   }
  //   return this.customerTransaction$.asObservable();
  // }
}
