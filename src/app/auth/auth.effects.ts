import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AuthActionTypes, Login, Logout } from './auth.actions';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { defer, of } from 'rxjs';

@Injectable()
export class AuthEffects {

  storageKey = 'be3295963d1091720c8513f78f83c216332190ff714a5239c8b49190443be288';

  @Effect({dispatch: false})
  login$ = this.actions$.pipe(
      ofType<Login>(AuthActionTypes.LoginAction),
      tap(action => localStorage.setItem(this.storageKey, JSON.stringify(action.payload.user)))
  );

  @Effect({dispatch: false})
  logout$ = this.actions$.pipe(
      ofType<Logout>(AuthActionTypes.LogoutAction),
      tap(() => {
        localStorage.removeItem(this.storageKey);
        this.router.navigateByUrl('/login');
      })
  );

  @Effect()
  init$ = defer(() => {
      const userData = JSON.parse(localStorage.getItem(this.storageKey));
      if (userData) {
        return of(new Login({user: userData}));
      } else {
       // return of(new Logout());
      }
  });

  constructor(private actions$: Actions, private router: Router) {}

}
