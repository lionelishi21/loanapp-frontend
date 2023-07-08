import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { accessToken } from './auth.selectors';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    storageKey = 'be3295963d1091720c8513f78f83c216332190ff714a5239c8b49190443be288';

    constructor( private store: Store<AppState>) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const currentToken$ = this.store.pipe(select(accessToken));

        const userData = JSON.parse(localStorage.getItem(this.storageKey));

        if (userData) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${userData.access_token}`
                }
            });
        }

        return next.handle(request);
    }
}
