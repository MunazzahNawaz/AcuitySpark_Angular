import { Injectable } from '@angular/core';
import { Rule, RuleType, RuleStatus } from '../models/rule';
import { ElasticSearchService } from './elastic-search.service';
import { Query } from '../models/query';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(
    private es: ElasticSearchService,
    private storeService: StoreService
  ) {}
  getCustomerData() {}
  processRules(rules: Array<Rule>) {
    rules.forEach(rule => {
      switch (rule.type) {
        case RuleType.sorter:
          this.es
            .searchDocuments(Query.getSortQuery(rule.column, rule.value))
            .then(response => {
              console.log('response of sort', response);
              this.processData(response.hits.hits);
              rule.status = RuleStatus.Applied;
              rule.isSelected = false;
            },
            error => {
              console.error('rule error', error);
              rule.status = RuleStatus.Error;
            });
          break;
      }
    });
  }

  private processData(data) {
    let dataset = [];
    data.forEach(x => {
      // x.Id = x._id;
      // console.log('x=', x._id);
      x._source.id = x._source.CustomerNo;
      dataset.push(x._source);
    });
    this.storeService.setcustomerFinalData(dataset);
  }
}
