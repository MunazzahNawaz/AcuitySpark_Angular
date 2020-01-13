import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { AppConfigService } from 'src/app/app-config.service';
import { Observable } from 'rxjs';
import { AppTransactionConfig } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  processedRules: Array<any> = [];

  constructor(
    private baseService: BaseService,
    protected http: HttpClient,
    protected appConfig: AppConfigService
  ) { }

  getCustomerData(filtersListModal): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_Customers';
    return this.baseService.post(url, filtersListModal);
  }
  getCustomerDataFull(filtersListModal, ps, pNo): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_All_Customers';
    const modal = { filterDataRequest: filtersListModal, pageSize: ps, pageNumber: pNo };
    return this.baseService.post(url, modal);
  }
  getDynamicsData(): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'DAX/customers';
    return this.baseService.get(url);
  }

  getCustomerTransaction(appTransactionConfig: AppTransactionConfig, isFiltered): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_CustomerTransaction';
    const data = {
      powerAppConfig: appTransactionConfig,
      isFiltered
    };
    return this.baseService.post(url, data);
  }

  getCustomerChildren(customerNo): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_Children/' + customerNo;
    const modal = {};
    return this.baseService.post(url, modal);
  }
  getRuleCount(ruleColumns, ruleType): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_CountRowsEffected';
    const modal = { type: ruleType, columns: ruleColumns };
    return this.baseService.post(url, modal);
  }
  getCustomerGroupData(statusId): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_GroupCustomers';
    const modal = { jobStatusId: statusId };
    return this.baseService.post(url, modal);
  }
  unMergeData(customerIds): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_UnMerge/';
    return this.baseService.post(url, customerIds);
  }
  getCandidateMerge(filtersModal, ps, pgNo): Observable<any> {
    let modal;
    if (filtersModal === undefined || filtersModal === null) {
      modal = {
        filters: [],
        filterByGrp: 'All',
        pageNumber: pgNo,
        pageSize: ps
      }
    }
    else {
      modal = {
        filters: filtersModal.filters,
        filterByGrp: filtersModal.filterByGrp,
        pageNumber: pgNo,
        pageSize: ps
      }
    }
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_GetCandidateMerged';
    return this.baseService.post(url, modal);
  }
  getMergedCustomers(modal): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_GetMergedCustomers';
    return this.baseService.post(url, modal);
  }

  getCandidateMergedGroups(): Observable<any> {
    let modal = {};
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_GetCandidateMergedGroups';
    return this.baseService.post(url, modal);
  }
  // processRules(rulesModel: Array<Rule>, sendBackToSourceFlag: boolean): Observable<any> {
  //   const model = { sendBackToSource: sendBackToSourceFlag, rules: rulesModel };
  //   const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'Rules/ProcessRules';
  //   return this.baseService.post(url, model);
  // }


}
