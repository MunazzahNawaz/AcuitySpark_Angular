import { Component, OnInit } from '@angular/core';
import { UserSettingService } from '../services/user-setting.service';
import { StoreService } from 'src/app/customer/services/store.service';
import { userSettings } from '../models/userSetting';
import { AppConfigService } from 'src/app/app-config.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss']
})
export class UserSettingComponent implements OnInit {
  userSettingsData: Array<userSettings> = null;
  allUserSettings: Array<any> = null;
  pageSizes = [];
  selectedPageSize;
  loggeInUserId;
  selcectAll = false;
  isIndeterminate = false;
  errorMsg;
  constructor(
    private userSettingService: UserSettingService,
    private storeService: StoreService,
    private appConfig: AppConfigService,
    private authService: AuthService) { }

  ngOnInit() {
    this.loggeInUserId = localStorage.getItem('userId');

    this.pageSizes = this.appConfig.getConfig('pageSizes');
    this.authService.getIsLoginReady().subscribe(isready => {
      if (isready && isready != null) {
        this.storeService.getUserSettings().subscribe(x => {
          console.log('IN GET USER SETTINGS', x);
          this.allUserSettings = x;
          if (x && x != null) {
            this.userSettingsData = x.filter(s => s.columnDbName != 'id');
            this.onIsAssignChange();
            if (this.userSettingsData && this.userSettingsData.length > 0) {
              const us = this.userSettingsData.find(setting => setting.userEmailId != null);
              if (us) {
                this.selectedPageSize = parseInt(us.defaultPageSize, 10);
              }
            }
          }
        });
      }
    });

  }
  selectAllClick() {
    this.selcectAll = !this.selcectAll;
    this.userSettingsData.forEach(setting => {
      setting.isAssigned = this.selcectAll;
    });
    this.onIsAssignChange();
  }
  onIsAssignChange() {
    if (this.userSettingsData) {
      const uncheckedCols = this.userSettingsData.filter(x => x.isAssigned === false);
      const checkedCols = this.userSettingsData.filter(x => x.isAssigned === true);
      if (uncheckedCols.length > 0) {
        this.selcectAll = false;
      } else {
        this.selcectAll = true;
      }
      if (uncheckedCols.length > 0 && checkedCols.length > 0) {
        this.isIndeterminate = true;
        this.selcectAll = null;
      } else {
        this.isIndeterminate = false;
      }
    }
  }
  onSaveClick() {
    const checkedCols = this.userSettingsData.filter(x => x.isAssigned === true);
    if (checkedCols.length <= 0) { // no selected Column
      this.errorMsg = 'Please select column(s)';

      setTimeout(() => {
        const elmnt = document.getElementById('err');
        console.log('element', elmnt);
        elmnt.scrollIntoView();
        elmnt.focus();
      }, 200);

      return;
    }
    this.errorMsg = '';
    if (!this.loggeInUserId || this.loggeInUserId == null) {
      this.storeService.getUser().subscribe(x => {
        if (x && x != null) {
          this.loggeInUserId = x.email;
          this.saveSettings();
        }
      });
    } else {
      this.saveSettings();
    }

  }
  saveSettings() {
    console.log('this.allUserSettings', this.allUserSettings);
    console.log('this.userSettingsData', this.userSettingsData);
    const idCol = this.allUserSettings.filter(x => x.columnDbName == 'id');
    if (idCol && idCol.length > 0) {
      this.userSettingsData.push(idCol[0]);
    }
    // this.allUserSettings.forEach(x => {
    //   x.defaultPageSize = this.selectedPageSize;
    //   x.userEmailId = this.loggeInUserId;
    //   let US = this.userSettingsData.filter(us => us.customerColumnId == x.customerColumnId);
    //   if (US && US.length > 0) {
    //     x.isAssigned = US[0].isAssigned;
    //     // x.ccId = US[0].isAssigned;
    //     //         columnId: string;
    //     //     columnName: string;
    //     //     dataType: string;
    //     //     isGolden: boolean;
    //     //     isDedupe: boolean;
    //     //     isHidden: boolean;
    //     //     usId: number;
    //     //     userEmailId: string;
    //     //     customerColumnId: number;
    //     //     defaultPageSize: string;
    //     //     usColumnId: string;
    //     //     isAssigned: boolean;

    //   }
    // });
    this.userSettingsData.forEach(x => {
      x.defaultPageSize = this.selectedPageSize;
      x.userEmailId = this.loggeInUserId;
    });
    this.userSettingService.setUserSettings(this.userSettingsData).subscribe(x => {
      this.storeService.refreshUserSettings();
    });
  }

}
