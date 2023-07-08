import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { BaseService } from '../shared/base-service';
import { User } from './model/user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends BaseService<User>{

    storageKey = 'be3295963d1091720c8513f78f83c216332190ff714a5239c8b49190443be288';

    constructor(private http: HttpClient, private router: Router) {
        super( http, '');
    }

    /**
     * Login api user and setup token for future use
     * @param username
     * @param password
     */
    login(username: string, password: string) {
        return this.http.post<any>(`${super.getApiUrl()}/login`, {email: username, password})
            .pipe(map((user) => {
                const decodedToken = jwt_decode(user.access_token);
                user.scope = decodedToken.scopes;
                return user;
            }));
    }

    /**
     *  Logout API level
     */
    logout() {
        return this.http.get<any>(`${super.getApiUrl()}/logout`)
            .pipe(map((data) => {
            }));
    }
}
