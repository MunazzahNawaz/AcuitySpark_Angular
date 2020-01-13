import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppConfigService {
  private config;

  constructor(private http: HttpClient) {
  }

  public getConfig(key: any) {
    return this.config[key];
  }

  loadAppConfig() {
    // const jsonFile = 'assets/appConfig.json';
    // return new Promise<void>((resolve, reject) => {
    //   this.http.get('assets/appConfig.json').toPromise().then((data) => {
    //     this.config = data;
    //     resolve();
    //   }).catch((response: any) => {
    //     reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
    //   });
    // });
    return new Promise<void>((resolve, reject) => {
    this.http
      .get('assets/appConfig.json')
      .toPromise()
      .then(data => {
        this.config = data;
        resolve();
      });
    });
  }
}

