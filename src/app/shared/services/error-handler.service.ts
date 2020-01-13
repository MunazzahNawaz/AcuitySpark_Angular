import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { Router } from '@angular/router';
declare var toastr;

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

  constructor(private injector: Injector) { }

  handleError(httpError: any): void {
    const router = this.injector.get(Router);
    if (httpError && httpError.status) {
      const status = httpError.status;
      // switch (status) {
      //   case 403:
      //     router.navigateByUrl('/error/403', { skipLocationChange: true });
      //     break;
      //   case 401:
      //     router.navigateByUrl('/error/401', { skipLocationChange: true });
      //     break;
      //   default:
      //     this.showErrorMessage(httpError);
      // }
    } else {
      this.showErrorMessage(httpError);
    }
  }
  showErrorMessage(error) {
    if (error.toString().indexOf('ExpressionChangedAfterItHasBeenCheckedError') > 0) {

    } else if (error.toString().toLowerCase().includes('user login is required')) {

    } else {
     // toastr.error(error.toString());
      console.log('Http Error', error.toString());
    }
  }
}
