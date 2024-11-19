import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocalService } from './local.service';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:8080/login/';
  constructor(private http: HttpClient,public router: Router, private localService: LocalService) {
  }
  login(data: any): Observable<any> {
      return this.http.post<any>(this.url, data, httpOptions).pipe(
          tap((result) => this.save_token(result)),
          catchError(this.handleError<any>('login'))
      );
  }
  private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
          return of(result as T);
      };
  }
  private save_token(data: { success: any; token: string; }) {
      if (data.success) {
          this.localService.saveData('token', data.token);
          return;
      }
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
