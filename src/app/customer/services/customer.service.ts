import { Injectable } from '@angular/core';
import { Rule } from '../models/rule';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { AppConfigService } from 'src/app/app-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  processedRules: Array<any> = [];

  constructor(
    // private es: ElasticSearchService,
    private baseService: BaseService,
    protected _http: HttpClient,
    protected appConfig: AppConfigService
  ) {}
  getCustomerData(): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'Customer';
    //   const modal = { PageNo: pageNo, PageSize: pageSize };
    const modal = {};
    return this.baseService.post(url, modal);
  }
  getCustomerChildren(customerNo): Observable<any> {
    const url =
      this.appConfig.getConfig('BASE_API_ENDPOINT') +
      'CustomerChildren/' +
      customerNo;
    const modal = {};
    return this.baseService.post(url, modal);
  }
  getCustomerGroupData(groupByField): Observable<any> {
    const url =
      this.appConfig.getConfig('BASE_API_ENDPOINT') + 'Customer/GroupCustomers';
    return this.baseService.post(url, groupByField);
  }
  processRules(rules: Array<Rule>): Observable<any> {
    console.log('rules', JSON.stringify(rules));
    const url =
      this.appConfig.getConfig('BASE_API_ENDPOINT') + 'Customer/processRules';
    return this.baseService.post(url, rules);
  }

  private processData(data) {
    const dataset = [];
    data.forEach(x => {
      // x.Id = x._id;
      // console.log('x=', x._id);
      x._source.id = x._source.CustomerNo;
      dataset.push(x._source);
    });
    // TODO: temp comment
    //  this.storeService.setcustomerFinalData(dataset);
  }

  private saveRules() {
    const ruleIndexName = 'rules_history';
    const typeName = 'rules';
    this.processedRules.forEach(rule => {
      // this.es
      //   .addToIndex({
      //     index: ruleIndexName,
      //     type: typeName,
      //     body: rule
      //   })
      //   .then(
      //     docResult => {
      //       console.log(docResult);
      //       console.log('Document added, see log for more info');
      //     },
      //     error => {
      //       console.log('Something went wrong, see log for more info');
      //       console.error(error);
      //     }
      //   );
    });
  }
}
