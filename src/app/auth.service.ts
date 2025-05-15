import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocalService } from './local.service';
import { LoginResponse } from './model/LoginResponse';
import { CustomHttpService } from './custom-http-service.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
    isLoggedIn = false;
  
    constructor(public router: Router, private localService: LocalService, private customHttpService: CustomHttpService) {
      this.isLoggedIn = !!this.localService.getData('authToken');
    }
  
    login(data: any): Observable<any> {
      if (!data) {
        console.error('No login data provided!');
        return of(null);
      }
      const loginPayload = {
        emailId: data.email,
        password: data.password,
      };
    
      return this.customHttpService.post<LoginResponse>('auth/login', loginPayload).pipe(
        tap(result => {
          if (result && result.token) {
            this.save_token(result.token);
            this.isLoggedIn = true;
          }
        }),
        catchError(error => {
          console.error('Login error', error);
          this.isLoggedIn = false;
          return of(null);
        })
      );
    }

  
    save_token(token: string): void {
      this.localService.saveData('authToken', token);
    }
  
    getToken(): string | null {
      return this.localService.getData('authToken');
    }
  

    canActivate(): boolean {
      const token =this.localService.getData('token');
          if (token == null)   {
              this.router.navigate(['login']);
              return false;
          }
          return true;
    }
  
}
