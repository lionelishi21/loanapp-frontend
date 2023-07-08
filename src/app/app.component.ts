import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from './reducers';
import { isLoggedIn, isLoggedOut } from './auth/auth.selectors';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  loading = true;

    constructor(private store: Store<AppState>, private router: Router) {
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.loading = true;
            }
            if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
                this.loading = false;
            }
        });
    }

  ngOnInit(): void {

   this.isLoggedIn$ = this.store.pipe(
        select(isLoggedIn)
    );

   this.isLoggedOut$ = this.store
       .pipe(select(isLoggedOut));
  }

}
