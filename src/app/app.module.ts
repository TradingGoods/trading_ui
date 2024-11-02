import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomErrorsHandler } from './login/custom-error-handler';
import { CustomHttpInterceptor } from './login/custom-http-interceptor';
import { LoginComponent } from './login/login.component';
import { OAuthModule } from 'angular-oauth2-oidc';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    OAuthModule.forRoot()
  ],
  providers: [
  //   {
  //     provide: ErrorHandler,
  //     useClass: CustomErrorsHandler
  // },
  // {
  //     provide: HTTP_INTERCEPTORS,
  //     useClass: CustomHttpInterceptor,
  //     multi: true
  // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
