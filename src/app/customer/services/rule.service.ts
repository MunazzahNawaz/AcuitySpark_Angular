import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RuleService {


  constructor(private baseService: BaseService,
              protected http: HttpClient,
              protected appConfig: AppConfigService
  ) {  }



  getAllRuleSet(): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_GetAllRuleSet';
    const modal = {};
    return this.baseService.post(url, modal);
  }

  getRuleSetById(id): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_GetRuleSetById';
    return this.baseService.post(url, id);
  }
  enableRuleSchedule(ruleScheduleId, flag): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_EnableRuleSchedule';
    const modal = {ruleScheduleId: ruleScheduleId, isEnabled: flag};
    return this.baseService.post(url, modal);
  }

  saveRuleSet(ruleSet): Observable<any> {
    const modal = ruleSet;//this.convertModel(ruleSet);
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_SaveRuleSet';
    return this.baseService.post(url, modal);
  }

  saveNonRecurringRule(nonRecurringRule): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_SaveNonRecurringRule';
    return this.baseService.post(url, nonRecurringRule);
  }

  getAllExportJobs(): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_GetAllExportJobs';
    const modal = {};
    return this.baseService.post(url, modal);
  }

  saveExportJob(exportJobObj): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_SaveExportJob';
    const modal = exportJobObj;
    return this.baseService.post(url, modal);
  }

  deleteExportJob(exportJobId): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_DeleteExportJobById';
    return this.baseService.post(url, exportJobId);
  }

  deleteRuleSet(ruleSetId): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_DeleteRuleSetById';
    return this.baseService.post(url, ruleSetId);
  }

  deleteScheduleById(scheduleId): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_DeleteScheduleById';
    return this.baseService.post(url, scheduleId);
  }


  getAddressStandardization(modal): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_GetFieldStandardization';
    return this.baseService.post(url, modal);
  }
  saveAddressStandardization(modal): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_SaveFieldStandardization';
    return this.baseService.post(url, modal);
  }

  getNameSynonyms(modal): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_GetNameSynonyms';
    return this.baseService.post(url, modal);
  }
  saveNameSynonyms(modal): Observable<any> {
    const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_SaveNameSynonyms';
    return this.baseService.post(url, modal);
  }
}
