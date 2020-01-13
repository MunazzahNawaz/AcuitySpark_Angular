import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/customer/services/base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';
import { Observable } from 'rxjs';
import { StoreService } from 'src/app/customer/services/store.service';

@Injectable({
  providedIn: 'root'
})
export class UserSettingService {

  constructor(
    private baseService: BaseService,
    protected http: HttpClient,
    protected appConfig: AppConfigService) { }

    getUserSettings(userEmailId): Observable<any> {
      const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_GetUserSettings';
      return this.baseService.postShare(url, userEmailId);
    }
    setUserSettings(data): Observable<any> {
      const url = this.appConfig.getConfig('BASE_API_ENDPOINT') + 'AS_MDM_SaveUserSettings';
      const modal = {userSettings: data};
      return this.baseService.post(url, modal);
    }
}
