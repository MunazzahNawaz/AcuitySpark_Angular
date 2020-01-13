import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/customer/services/base.service';

import { AppConfigService } from 'src/app/app-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RowCountService {

  constructor(
    private baseService: BaseService,
    protected appConfig: AppConfigService) { }
  getTotalRecordsCount(): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_TotalRecords';
    return this.baseService.post(url, {});
  }
  getDuplicateRecordsCount(columnID): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_DuplicateRecords';
    return this.baseService.post(url, columnID);
  }

  GetUniqueKeys(columnID): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_GetUniqueKeys';
    return this.baseService.post(url, columnID);
  }

  getMasterRecordsCount(): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_MasterRecords';
    return this.baseService.post(url, {});
  }

  getCandidateMergeRecordsCount(): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_CandidateMergeTotal';
    return this.baseService.post(url, {});
  }

}

