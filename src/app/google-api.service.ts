import { Injectable, NgZone } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, tap } from 'rxjs';
import { LocalService } from './local.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CustomHttpService } from './custom-http-service.service';

declare var google: any;

const oAuthConfig : AuthConfig = {
  issuer : 'https://accounts.google.com',
  strictDiscoveryDocumentValidation : false,
  redirectUri : window.location.origin,
  clientId : '30867431224-5ei6frs1e5phh94nnicngss4p4ecs1rd.apps.googleusercontent.com',
  scope : 'openid profile email'
}

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  constructor(private ngZone: NgZone,private localService: LocalService, private router: Router,private customHttpService: CustomHttpService){

  }

  private authResponse = new BehaviorSubject<any>(null);
  authResponse$ = this.authResponse.asObservable();
  private initialized = false;

  initializeAuth() {
    if (this.initialized) return;

    this.ensureGoogleLoaded(() => {
      google.accounts.id.initialize({
        client_id: oAuthConfig.clientId,
        callback: (response: any) => this.callbackHandle(response),
      });
      console.log("Google initialized.");
      this.initialized = true;
      this.renderButton('google-btn');
    });
  }

  private renderButton(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      google.accounts.id.renderButton(element, {
        theme: 'filled_blue',
        size: 'large',
        shape: 'rectangle',
        width: 350,
      });
      console.log("Google button rendered.");
    } else {
      console.error("Button element not found.");
    }
  }

  callbackHandle(response: any) {
    console.log('Google API response:', response);
    this.authResponse.next(response);
  }

  private ensureGoogleLoaded(callback: () => void) {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
      callback();
    } else {
      const interval = setInterval(() => {
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
          clearInterval(interval);
          callback();
        }
      }, 200);
    }
  }
  logout() {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
      google.accounts.id.disableAutoSelect();
    }
  
    this.authResponse.next(null);
  
    sessionStorage.removeItem('authToken');
    this.localService.clearData();
    console.log("User logged out.");
    this.initialized = false;
    this.router.navigate(['/login']);
  }
  saveToken(response : any){
    this.localService.saveData('token',JSON.stringify(response));
    this.customHttpService.post('api/auth/google-login',response)
      .pipe(
        tap((backendResponse: any) => {
          this.ngZone.run(() => {
            const encodedData = encodeURIComponent(JSON.stringify(backendResponse));
            this.router.navigate(['/create-account'], { queryParams: { data: encodedData } });
          });
        })
      )
      .subscribe({
        error: (err) => {
          console.error('Error verifying token:', err);
        }
      });
  }
}
