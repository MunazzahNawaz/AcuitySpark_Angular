import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/customer/services/base.service';
import { AppConfigService } from 'src/app/app-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private baseService: BaseService,
    protected appConfig: AppConfigService) { }

    getJobStatusCount(): Observable<any> {
      const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_GetCountOfJobStatuses';
      return this.baseService.post(url, {});
    }
    getAllCounts(): Observable<any> {
      const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_GetAllCounts';
      return this.baseService.post(url, {});
    }
}
