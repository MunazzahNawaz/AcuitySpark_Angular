import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { AppConfigService } from 'src/app/app-config.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RuleScheduleService {

  constructor(private baseService: BaseService,
              protected http: HttpClient,
              protected appConfig: AppConfigService) { }

    setRuleSchedule(scheduleModal): Observable<any> {
      const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_SetRulesSchedule';
      return this.baseService.post(url, scheduleModal);
    }

    getRuleScheduleByRuleSetId(ruleSetId): Observable<any> {
      const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_GetScheduleByRuleSetId';
      return this.baseService.post(url, ruleSetId);
    }
}
