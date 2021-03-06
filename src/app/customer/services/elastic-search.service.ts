import { Injectable } from '@angular/core';
import { Client } from 'elasticsearch-browser';
import { Query } from '../models/query';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ElasticSearchService {
  private client: Client;
  private customerSources: Array<any> = [];

  constructor(
    private appConfig: AppConfigService
  ) {
    if (!this.client) {
      this.connect();
      this.loadFullCustomerData();
    }
  }

  private connect() {
    this.client = new Client({
      host: this.appConfig.getConfig('elastricSearchUrl'), // 'http://sl-febi:9200',
      log: 'trace'
    });
    console.log('client', this.client);
  }
  isAvailable(): any {
    return this.client.ping({
      requestTimeout: Infinity,
      body: 'hello !'
    });
  }

  addToIndex(value): any {
    return this.client.index(value);
  }
  ping() {
    this.client.ping({
      requestTimeout: Infinity,
      body: 'hello !'
    });
  }
  createRulesIndex(indexName, typeName) {
    return this.client.indices.create({ index: indexName, type: typeName });
  }

  getAllDocuments(): any {
    console.log(
      'Query.queryalldocs',
      Query.getAllDocsQuery(this.appConfig.getConfig('threshHold'))
    );
    return this.client.search({
      index: this.appConfig.getConfig('elasticSearchIndex'),
      type: this.appConfig.getConfig('elasticSearchType'),
      body: Query.getAllDocsQuery(this.appConfig.getConfig('threshHold')) //,
      // filterPath: ['hits.hits._source']
    });
  }

  searchDocuments(query): any {
    return this.client.search({
      index: this.appConfig.getConfig('elasticSearchIndex'),
      type: this.appConfig.getConfig('elasticSearchType'),
      body: query //,
      // filterPath: ['hits.hits._source']
    });
  }
  searchDuplicateRecords(): any {
    return this.client.search({
      index: this.appConfig.getConfig('elasticSearchIndex'),
      type: this.appConfig.getConfig('elasticSearchType'),
      body: {
        aggs: {
          dedup: {
            terms: {
              field: 'FirstName'
            },
            aggs: {
              dedup_docs: {
                top_hits: {
                  size: 2
                }
              }
            }
          }
        }
      }
      //     filterPath: ['hits.hits._source']
    });
  }
  loadFullCustomerData() {
    const dataset = [];
    this.getAllDocuments()
      .then(
        response => {
          console.log('full data customer response', response);
          localStorage.setItem('totalRecords', response.hits.total.value);
          this.customerSources = response.hits.hits;
          this.customerSources.forEach(x => {
            // x.Id = x._id;
            // console.log('x=', x._id);
            x._source.id = x._source.CustomerNo;
            dataset.push(x._source);
          });
          // this.storeService.setcustomerFinalData(dataset);
        },
        error => {
          console.error(error);
        }
      )
      .then(() => {
        console.log('Show Customer Completed!');
      });
  }
}
