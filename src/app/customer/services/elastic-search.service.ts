import { Injectable } from '@angular/core';
import { Client } from 'elasticsearch-browser';
import { AppConfig } from 'src/app/app-config';
import { Query } from '../models/query';
import { StoreService } from './store.service';
// import * as elasticsearch from 'elasticsearch';

@Injectable({
  providedIn: 'root'
})
export class ElasticSearchService {
  private client: Client;
  private customerSources: Array<any> = [];

  constructor(private storeService: StoreService) {
    if (!this.client) {
      this.connect();
      this.loadFullCustomerData();
    }
  }

  private connect() {
    this.client = new Client({
      host: AppConfig.elastricSearchUrl, //'http://sl-febi:9200',
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
    // this.client.bulk()
    return this.client.create(value);
  }
  ping() {
    this.client.ping({
      requestTimeout: Infinity,
      body: 'hello !'
    });
  }

  getAllDocuments(): any {
    console.log('Query.queryalldocs', Query.queryalldocs);
    return this.client.search({
      index: AppConfig.elasticSearchIndex,
      type: AppConfig.elasticSearchType,
      body: Query.queryalldocs,
      filterPath: ['hits.hits._source']
    });
  }

  searchDocuments(query): any {
    return this.client.search({
      index: AppConfig.elasticSearchIndex,
      type: AppConfig.elasticSearchType,
      body: query,
      filterPath: ['hits.hits._source']
    });
  }
  searchDuplicateRecords(): any {
    return this.client.search({
      index: AppConfig.elasticSearchIndex,
      type: AppConfig.elasticSearchType,
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
      },
      filterPath: ['hits.hits._source']
    });
  }
  loadFullCustomerData() {
    let dataset = [];
    this.getAllDocuments()
      .then(
        response => {
          console.log('response', response);
          this.customerSources = response.hits.hits;
          this.customerSources.forEach(x => {
            // x.Id = x._id;
            // console.log('x=', x._id);
            x._source.id = x._source.CustomerNo;
            dataset.push(x._source);
          });
          this.storeService.setcustomerFinalData(dataset);
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
