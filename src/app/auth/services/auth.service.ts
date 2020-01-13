import { Injectable } from '@angular/core';
// import { MsalService } from '@azure/msal-angular';
import * as jwt_decode from 'jwt-decode';
import * as Msal from 'msal';
import { Client } from '@microsoft/microsoft-graph-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppConfigService } from 'src/app/app-config.service';
import { RoleService } from './role.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private isLoginReady: BehaviorSubject<any>;
    public authenticated: boolean;
    public user;
    public clientApplication;
    public tenantConfig;
    constructor(
        private appConfig: AppConfigService,
        private roleService: RoleService) {
    }

    initialize(config) {
        this.tenantConfig = {
            tenant: config.tenant,
            clientID: config.clientID,
            scope: config.scope,
            redirectUri: config.redirectUri,
            authority: config.authority
        };
        this.clientApplication = new Msal.UserAgentApplication(
            this.tenantConfig.clientID, this.tenantConfig.authority,
            function (errorDesc: any, access_token: any, error: any, tokenType: any) {
                // console.log('After login');
                // console.log('token', access_token);
                // console.log('tokenType', tokenType);
            }, { redirectUri: this.tenantConfig.redirectUri, navigateToLoginRequestUrl: false,  loadFrameTimeout: 30000 }
        );
        const token = sessionStorage.getItem('graph_token');
        //        console.log('IN AUTH INIT TOken', token);
        if (token && token != null) {
            this.isLoginReady = new BehaviorSubject<any>(true);
        } else {
            this.isLoginReady = new BehaviorSubject<any>(null);
        }
        const roles = localStorage.getItem('userRoles');
        if (roles && roles.length > 0) {
            this.roleService.updateRoles(roles);
        }

    }
    // Prompt the user to sign in and
    // grant consent to the requested permission scopes
    login() {
        //    console.log('BEFORE LOGIN');
        this.setIsLoginReady(false);
        // this.msalService.loginRedirect();
        this.clientApplication.loginRedirect(this.tenantConfig.scope);
        this.getToken(this.tenantConfig.scope);
    }

    // Sign out
    logOut(): void {
        this.user = null;
        this.authenticated = false;
        sessionStorage.removeItem('graph_token');
        sessionStorage.removeItem('access_token');
        localStorage.removeItem('userRoles');
        localStorage.removeItem('userId');
        this.clientApplication.logout();
    }

    // Silently request an access token
    getToken(scopes) {
        console.log('token start', Date.now());
        this.clientApplication.acquireTokenSilent(scopes).then((token: string) => {
            this.afterAcquireToken(token);
            // /*******************GET TOKEN FOR GRAPH API**** */
            // this.clientApplication.acquireTokenSilent(this.appConfig.getConfig('AuthGraphScopes')).then(
            //     (graphToken: string) => {
            //         sessionStorage.setItem('graph_token', graphToken);
            //         localStorage.setItem('userId', this.getEmail());
            //         this.getUserRoles().then(roles => {
            //             localStorage.setItem('userRoles', roles);
            //             this.roleService.updateRoles(roles);
            //             this.setIsLoginReady(true);
            //         });
            //     });
            // /************************ */
            // sessionStorage.setItem('access_token', token);
            // const decodedToken = jwt_decode(token);
            // //  console.log('decoded Token', decodedToken);
            // sessionStorage.setItem('tokenExpiry', decodedToken.exp);
            // this.refreshTokenSubject.next(token);
        }, error => {
            console.log('error in acquireTokenSilent', error);
            this.clientApplication.acquireTokenPopup(scopes)
                .then(accessToken => {
                        this.afterAcquireToken(accessToken);
                    },
                    err => {
                        console.error('error in acquire token popup', err);
                    }
                );
        });
    }
    afterAcquireToken(token) {
        console.log('got access token ', Date.now());
        sessionStorage.setItem('access_token', token);
        const decodedToken = jwt_decode(token);
        //  console.log('decoded Token', decodedToken);
        sessionStorage.setItem('tokenExpiry', decodedToken.exp);
        /*******************GET TOKEN FOR GRAPH API**** */
        console.log('b4 graph token ', Date.now());
        this.clientApplication.acquireTokenSilent(this.appConfig.getConfig('AuthGraphScopes')).then(
            (graphToken: string) => {
                console.log('got graph token ', Date.now());
                sessionStorage.setItem('graph_token', graphToken);
                localStorage.setItem('userId', this.getEmail());
                this.getUserRoles().then(roles => {
                    localStorage.setItem('userRoles', roles);
                    this.roleService.updateRoles(roles);
                    this.setIsLoginReady(true);
                    this.refreshTokenSubject.next(token);
                });
            }, error => {
                console.log('error in acquireTokenSilent for graph', error);
            });
        /*************************/
    }
    public getAuthorizationHeaderValue(): string {
        // let token = sessionStorage.getItem('access_token');
        const token = sessionStorage.getItem('msal.idtoken');
        return `Bearer ` + token;

    }
    public getEmail() {
        if (this.getUser()) {
            return this.getUser().idToken['preferred_username'];
        } else {
            return 'NOT LOGGED IN';
        }
    }

    public getUserName() {
        if (this.getUser()) {
            return this.getUser().name;
        } else {
            return 'NOT LOGGED IN';
        }
    }

    public getUser() {
        return this.clientApplication.getUser();
    }
    public isTokenExpired() {
        //   console.log('in is token expired');
        const currentTime = Date.now() / 1000;
        const tokenExpiry = +(sessionStorage.getItem('tokenExpiry'));
        // console.log('current_time', current_time);
        //  console.log('tokenExpiry', tokenExpiry);
        if (tokenExpiry < currentTime) {
            return true;
        }
        return false;
    }
    isLoggedIn(): boolean {
        // return this.authenticated;
        if (this.clientApplication.getUser() == null) {
            return false;
        }
        return true;
    }
    public refreshToken(): Observable<any> {
        return this.refreshTokenSubject.asObservable();
    }
    public setRefreshToken(value) {
        this.refreshTokenSubject.next(value);
    }
    public setIsLoginReady(flag) {
        //  console.log('in set IsLoginReady', flag);
        this.isLoginReady.next(flag);
    }
    public getIsLoginReady() {
        return this.isLoginReady.asObservable();
    }
    public async getUserRoles() {
        // console.log('IN GET USER ROLES');
        if (!this.isLoggedIn || !sessionStorage.getItem('graph_token')) {
            return null;
        }
        const graphClient = Client.init({
            // Initialize the Graph client with an auth provider that requests the token from the auth service
            authProvider: async (done) => {
                const token = sessionStorage.getItem('graph_token');
                if (token) {
                    done(null, token);
                } else {
                    done('Could not get an access token', null);
                }
            }
        });

        // Get the user from Graph (GET /me)
        const content = '{securityEnabledOnly: true}';
        const graphUser = await graphClient.api('/me/getMemberGroups').post(content);
        // console.log('graph user', graphUser);
        return graphUser.value;
    }

}
