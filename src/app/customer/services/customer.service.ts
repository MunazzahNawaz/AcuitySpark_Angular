import { Injectable } from '@angular/core';
import { Rule, RuleType, RuleStatus } from '../models/rule';
import { ElasticSearchService } from './elastic-search.service';
import { Query } from '../models/query';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  processedRules: Array<any> = [];

  constructor(
    private es: ElasticSearchService,
    private storeService: StoreService
  ) {}
  getCustomerData() {}
  processRules(rules: Array<Rule>) {
    let query = '';
    rules.forEach(rule => {
      switch (rule.type) {
        case RuleType.sorter:
          query = Query.getSortQuery(rule.column, rule.value);
          break;
        case RuleType.filter:
          query = Query.getFilterQuery(rule.column, rule.value);
          break;
      }
      this.es.searchDocuments(query).then(
        response => {
          console.log('response of query', response);
          this.processData(response.hits.hits);
          rule.status = RuleStatus.Applied;
          rule.isSelected = false;
          this.processedRules.push(rule);
          if (this.processRules.length == rules.length) {
            this.saveRules();
          }
        },
        error => {
          console.error('rule error', error);
          rule.status = RuleStatus.Error;
        }
      );
    });
  }

  private processData(data) {
    const dataset = [];
    data.forEach(x => {
      // x.Id = x._id;
      // console.log('x=', x._id);
      x._source.id = x._source.CustomerNo;
      dataset.push(x._source);
    });
    this.storeService.setcustomerFinalData(dataset);
  }

  private saveRules() {
    const ruleIndexName = 'rules_history';
    const typeName = 'rules';
    this.processedRules.forEach(rule => {
      this.es
        .addToIndex({
          index: ruleIndexName,
          type: typeName,
          body: rule
        })
        .then(
          docResult => {
            console.log(docResult);
            console.log('Document added, see log for more info');
          },
          error => {
            console.log('Something went wrong, see log for more info');
            console.error(error);
          }
        );
    });
  }
}
