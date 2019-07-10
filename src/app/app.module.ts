import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfigService } from './app-config.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
      return appConfig.loadAppConfig();
  };
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    LoadingBarHttpClientModule,
    NgxSpinnerModule
  ],
  providers: [
    AppConfigService,
    {
        provide: APP_INITIALIZER,
        useFactory: appInitializerFn,
        multi: true,
        deps: [AppConfigService]
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
