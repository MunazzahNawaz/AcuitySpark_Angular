import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/app-config.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { BaseService } from './base.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { tap, catchError, map } from 'rxjs/operators';
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

    return this.http.post<any>(this.appConfig.getConfig('BASE_API_ENDPOINT') + 'FileUpload', 
    formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(map((event) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          const progress = Math.round(100 * event.loaded / event.total);
          return { status: 'progress', message: progress };

        case HttpEventType.Response:
          return event.body;
        default:
          return { status: 'error', message: event.type };
      }
    })
    );
    // return this.http
    //   .post(
    //     this.appConfig.getConfig('BASE_API_ENDPOINT') + 'FileUpload',
    //     formData
    //   )
    //   .pipe(
    //     tap(
    //       response => {
    //         this.spinner.hide();
    //       },
    //       err => {
    //         this.spinner.hide();
    //         console.log(err);
    //         return throwError(err);
    //       }
    //     ),
    //     catchError(this.handleErrorObservable)
    //   );
  }
}
