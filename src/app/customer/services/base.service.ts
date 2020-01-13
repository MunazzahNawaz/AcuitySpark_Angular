import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap, share } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
declare var toastr;

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  constructor(protected http: HttpClient, protected spinner: NgxSpinnerService) {}
  get(url: string): Observable<any> {
    this.spinner.show();
    return this.http.get<any>(url).pipe(
      tap(
        response => {
          this.spinner.hide();
        },
        err => {
          this.spinner.hide();
          return throwError(err);
        }
      ),
      catchError(this.handleErrorObservable)
    );
  }
  postShare(url: string, model: any): Observable<any> {
    this.spinner.show();
    const body = JSON.stringify(model);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {
      headers
    };
    // return this._http.post(url, body, options)

    return this.http.post<any>(url, body, options).pipe(
      tap(
        response => {
          this.spinner.hide();
        },
        err => {
          this.spinner.hide();
          return throwError(err);
        }
      ),
      share(),
      catchError(this.handleErrorObservable)
    );
  }
  post(url: string, model: any): Observable<any> {
    this.spinner.show();
    const body = JSON.stringify(model);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {
      headers
    };
    // return this._http.post(url, body, options)

    return this.http.post<any>(url, body, options).pipe(
      tap(
        response => {
          this.spinner.hide();
        },
        err => {
          this.spinner.hide();
          return throwError(err);
        }
      ),
      catchError(this.handleErrorObservable)
    );
  }

  del(url: string): Observable<any> {
    return this.http.delete<any>(url).pipe(
      tap(
        response => {
          this.spinner.hide();
        },
        err => {
          this.spinner.hide();
          return throwError(err);
        }
      ),
      catchError(this.handleErrorObservable)
    );
  }
  handleErrorObservable(error: Response | any) {
    // this.spinner.hide();
   // console.error(error.message || error);
   // toastr.error('Failed to Perform Operation');
    return throwError(error);
  }
  // extractData(res: Response) {
  //   this.spinner.hide();
  //   return res;
  // }
}
