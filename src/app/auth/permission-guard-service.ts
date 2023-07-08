import { CanLoad, Route, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { allScopes } from './auth.selectors';
import { Logout } from './auth.actions';

@Injectable({ providedIn: 'root' })
export class PermissionGuardService implements CanLoad  {

    private currentUser;
    private permissions = [];

    constructor(private store: Store<AppState>, private router: Router) { }

    canLoad(route: Route): boolean {
        // permissions will be passed from the route config on the data property
        this.permissions = route.data.permissions;
        const token = localStorage.getItem('token');
        // decode the token to get its payload

        // Fetch all scopes from redux store
        this.store.pipe(select(allScopes)).subscribe(user => {
            this.currentUser = user;
        });

        if (this.checkPermission()) {
            return true;
        }
        this.store.dispatch(new Logout());
        return false;
    }


    /**
     *
     */
    private checkPermission() {
        let hasPermission = false;
        if (this.currentUser && this.permissions !== undefined ) {
            for (const checkPermission of this.permissions) {
                const permissionFound = this.currentUser.find(x => x.toUpperCase() === checkPermission.toUpperCase());
                if (permissionFound) {
                    hasPermission = true;
                }
            }
        }

        return hasPermission;
    }

}
