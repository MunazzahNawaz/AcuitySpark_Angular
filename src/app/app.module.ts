import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfigService } from './app-config.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { LayoutModule } from './layout/layout.module';
import { MatMenuModule } from '@angular/material/menu';
import { TokenInterceptor } from './token.interceptor';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { AuthService } from './auth/services/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ErrorHandlerService } from './shared/services/error-handler.service';
import { SharedModule } from './shared/shared.module';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { ResetComponent } from './shared/reset/reset.component';
import { MatProgressBarModule } from '@angular/material';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: false,
  wheelPropagation: true
};
const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};
let adalConfig: any; // will be initialized by APP_INITIALIZER
export function msAdalAngular6ConfigFactory() {
  return adalConfig; // will be invoked later when creating MsAdalAngular6Service
}

export function getAdalConfig() {
  return adalConfig;
}

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    MatTooltipModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    LoadingBarHttpClientModule,
    NgxSpinnerModule,
    PerfectScrollbarModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatMenuModule,
    MatCardModule,
    MatRippleModule,
    SharedModule,
    // MatProgressSpinnerModule,
    MatDialogModule,
    MatProgressBarModule
  ],
  entryComponents: [
    ResetComponent
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService]
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: 'adalConfig',
      useFactory: msAdalAngular6ConfigFactory,
      deps: []
    },
    // AuthenticationGuard,
    AuthService,
    { provide: ErrorHandler, useClass: ErrorHandlerService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(authService: AuthService, appConfig: AppConfigService) {
    let msalConfig: any;
    const promise = appConfig.loadAppConfig().then(() => {
      msalConfig = {
        tenant: appConfig.getConfig('AuthTenantId'),
        clientID: appConfig.getConfig('AuthClientId'),
        scope: appConfig.getConfig('AuthScopes'),
        redirectUri: appConfig.getConfig('redirectUri'),
        authority: 'https://login.microsoftonline.com/' + appConfig.getConfig('AuthTenantId') + '/'
      };
      authService.initialize(msalConfig);
    });
  }
}
