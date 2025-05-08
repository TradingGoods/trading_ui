import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LocalService } from '../local.service';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
    constructor(private router: Router,private localStore: LocalService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
        const rawToken = this.localStore.getData('token');

        if (!rawToken) {
            // Redirect only for protected routes
            if (!req.url.includes('/login')) {
            this.router.navigate(['/login']);
            }
            return next.handle(req); // Let the request go through (or you can cancel it)
        }

        try {
            const obj = JSON.parse(rawToken);
            const cloned = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${obj.credential}`),
                    });
            return next.handle(cloned);
        } catch (e) {
            console.error('Token parsing error:', e);
            this.router.navigate(['/login']);
            return next.handle(req);
        }
    }
}