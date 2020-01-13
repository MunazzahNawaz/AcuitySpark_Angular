import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobStatusService {

  constructor( private baseService: BaseService,
               protected http: HttpClient,
               protected appConfig: AppConfigService) { }

  getJobStatus(): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_GetAllJobStatuses';
    const modal = {};
    return this.baseService.post(url, modal);
  }
}
