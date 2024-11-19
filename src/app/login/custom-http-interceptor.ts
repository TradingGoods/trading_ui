import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LocalService } from '../local.service';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
    constructor(private router: Router,private localStore: LocalService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    

        let obj = JSON.parse(this.localStore.getData('token') || '');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${obj.credential}`);

        if (obj != null) {
            req = req.clone({
                headers: headers 
            });
        }
        else {
            if (req.url != 'login') {
                this.router.navigate(['login']);
                // return;
            }
        }
        return next.handle(req);
    }
}