import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/app-config.service';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService extends BaseService {
  constructor(
    protected http: HttpClient,
    protected appConfig: AppConfigService,
    protected spinner: NgxSpinnerService
  ) {
    super(http, spinner);
  }
  uploadDoc(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http
      .post(
        this.appConfig.getConfig('BASE_API_ENDPOINT') + 'FileUpload',
        formData
      )
      .pipe(
        tap(
          response => {
            this.spinner.hide();
          },
          err => {
            this.spinner.hide();
            console.log(err);
            return throwError(err);
          }
        ),
        catchError(this.handleErrorObservable)
      );
  }
}
