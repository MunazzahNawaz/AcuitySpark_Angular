import { Injectable } from '@angular/core';
import { Rule } from '../models/rule';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { AppConfigService } from 'src/app/app-config.service';
import { Observable } from 'rxjs';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  processedRules: Array<any> = [];

  constructor(
    // private es: ElasticSearchService,
    private baseService: BaseService,
    protected _http: HttpClient,
    protected appConfig: AppConfigService,
    protected storeService: StoreService
  ) {}
  getCustomerData(pageSize, pageNo): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'Customer';
    const modal = { PageNo: pageNo, PageSize: pageSize };
    return this.baseService.post(url, modal);
  }
  getCustomerGroupData(groupByField): Observable<any> {
    const url =
      this.appConfig.getConfig('BASE_API_ENDPOINT') + 'Customer/GroupCustomers';
    return this.baseService.post(url, groupByField);
  }
  processRules(rules: Array<Rule>) {
    let query = '';
    console.log('rules', JSON.stringify(rules));
    const url =
      this.appConfig.getConfig('BASE_API_ENDPOINT') + 'Customer/processRules';
    this.baseService.post(url, rules).subscribe(x => {
      this.storeService.setcustomerFinalData(x.customer);
      this.storeService.setCustomerRules(x.rules);
      this.storeService.setCustomerArchivedRules(x.rules);
    });

    // rules.forEach(rule => {
    //   // switch (rule.type) {
    //   //   case RuleType.sorter:
    //   //     query = Query.getSortQuery(
    //   //       rule.column,
    //   //       rule.value,
    //   //       this.appConfig.getConfig('threshHold')
    //   //     );
    //   //     break;
    //   //   case RuleType.filter:
    //   //     query = Query.getFilterQuery(rule.column, rule.value);
    //   //     break;
    //   // }
    //   // this.es.searchDocuments(query).then(
    //   //   response => {
    //   //     console.log('response of query', response);
    //   //     this.processData(response.hits.hits);
    //   //     rule.status = RuleStatus.Applied;
    //   //     rule.isSelected = false;
    //   //     this.processedRules.push(rule);
    //   //     if (this.processRules.length == rules.length) {
    //   //       this.saveRules();
    //   //     }
    //   //   },
    //   //   error => {
    //   //     console.error('rule error', error);
    //   //     rule.status = RuleStatus.Error;
    //   //   }
    //   // );
    // });
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
