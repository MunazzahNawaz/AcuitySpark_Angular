import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
// import { MsalService } from './auth/services/msal.service';
import { throwError, Observable } from 'rxjs';
import { catchError, filter, finalize, take, switchMap } from 'rxjs/operators';
import { AuthService } from './auth/services/auth.service';
import { AppConfigService } from './app-config.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private refreshTokenInProgress = false;


    constructor(public authService: AuthService, private appConfig: AppConfigService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone();
        this.authService.isTokenExpired();

        request = this.addAuthenticationToken(request);
       // return next.handle(request);
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error && error.status === 401 && this.authService.isTokenExpired()) {
                    // 401 error with token expired, we need to refresh.
                    if (this.refreshTokenInProgress) {
                        // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
                        // which means the new token is ready and we can retry the request again
                        return this.authService.refreshToken().pipe(
                            filter(result => result !== null),
                            take(1),
                            switchMap(() => next.handle(this.addAuthenticationToken(request)))
                        );
                    } else {
                        this.refreshTokenInProgress = true;

                        // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
                        this.authService.setRefreshToken(null);
                        this.authService.getToken(this.appConfig.getConfig('AuthScopes'));

                        return this.authService.refreshToken().pipe(
                            filter(result => result !== null),
                            take(1),
                            switchMap(() => next.handle(this.addAuthenticationToken(request))),
                            finalize(() => (this.refreshTokenInProgress = false))
                        );

                    }
                } else {
                    return throwError(error);
                }
            })
        );
    }
    // private refreshAccessToken(): Observable<any> {
    //     return of('secret token');
    // }
    private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
        // let headerToken = this.authService.getAuthorizationHeaderValue();
        const contentType = request.headers.get('Content-Type');
        if (contentType && contentType != null) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('access_token'),
                    GraphToken: 'Bearer ' + sessionStorage.getItem('graph_token'),
                    'Content-Type': contentType
                }
            });
        } else {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('access_token'),
                    GraphToken: 'Bearer ' + sessionStorage.getItem('graph_token')
                }
            });
        }
        return request;
    }
}
