import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
declare var toastr;

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  constructor(private http: HttpClient) {}
  get(url: string): Observable<any> {
    return this.http.get<any>(url).pipe(
      map(this.extractData),
      catchError(this.handleErrorObservable)
    );
  }
  post(url: string, model: any): Observable<any> {
    return this.http.post<any>(url, model).pipe(
      map(this.extractData),
      catchError(this.handleErrorObservable)
    );
  }

  del(url: string): Observable<any> {
    return this.http.delete<any>(url).pipe(
      map(this.extractData),
      catchError(this.handleErrorObservable)
    );
  }
  handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    toastr.error('Failed to Perform Operation');
    return throwError(error.message || error);
  }
  extractData(res: Response) {
    //  console.log(res);
    return res;
  }
}
