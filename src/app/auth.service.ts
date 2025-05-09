import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocalService } from './local.service';
import { environment } from 'src/environments/environment';
import { LoginResponse } from './model/LoginResponse';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})

export class AuthService {
    isLoggedIn = false;
  
    constructor(private http: HttpClient, public router: Router, private localService: LocalService) {
      // You might want to check for an existing token on service initialization
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
    
      return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, loginPayload, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        // You might need to include withCredentials if your backend uses cookies
      }).pipe(
        tap(result => {
          if (result && result.token) { // Assuming your backend returns a 'token'
            this.save_token(result.token);
            this.isLoggedIn = true;
          }
        }),
        catchError(error => {
          console.error('Login error', error);
          this.isLoggedIn = false;
          return of(null); // Return null or handle the error as needed
        })
      );
    }

  
    save_token(token: string): void {
      this.localService.saveData('authToken', token);
    }
  
    getToken(): string | null {
      return this.localService.getData('authToken');
    }
  
    // logout(): void {
    //   this.localService.removeData('authToken');
    //   this.isLoggedIn = false;
    //   this.router.navigate(['/login']); // Redirect to login page after logout
    // }

    canActivate(): boolean {
      const token =this.localService.getData('token');
          if (token == null)   {
              this.router.navigate(['login']);
              return false;
          }
          return true;
    }
  
}
