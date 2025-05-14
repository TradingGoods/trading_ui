import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LocalService } from '../local.service';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
    constructor(private router: Router,private localStore: LocalService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
        const token = this.localStore.getData('authToken');

        if (!token) {
            // Redirect only for protected routes
            if (!req.url.includes('/login')) {
            this.router.navigate(['/login']);
            }
            return next.handle(req);
        }

        try {

            const token = localStorage.getItem('authToken');

            if (token) {
                const authHeaders = req.headers.set('Authorization', `Bearer ${token}`);
                const cloned = req.clone({
                    headers: authHeaders,
                });

                return next.handle(cloned);
            }
            return next.handle(req);
        } catch (e) {
            console.error('Token parsing error:', e);
            this.router.navigate(['/login']);
            return next.handle(req);
        }
    }
}