import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { Login, Logout } from '../auth.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { tap } from 'rxjs/operators';

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    returnUrl: string;
    loginError = '';
    loader = false;

    constructor(private fb: FormBuilder, private store: Store<AppState>, private route: ActivatedRoute,
                private router: Router, private authenticationService: AuthenticationService) {
        this.loginForm = fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.store.dispatch(new Logout());
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    /**
     * Fetch email field
     */
    get email() {
        return this.loginForm.get('email');
    }

    /**
     * Fetch password field
     */
    get password() {
        return this.loginForm.get('password');
    }

    /**
     * Login user against api
     */
    login() {
        this.loginError = '';
        this.loader = true;

        this.authenticationService.login(this.email.value, this.password.value)
            .pipe(tap(
                user => {
                    this.loader = false;
                    this.store.dispatch(new Login({user}));
                    this.router.navigate([this.returnUrl]);
                }
            ))
            .subscribe(
                () => {},
                (error) => {
                    console.log(error);
                    if (error.error.message) {
                        this.loginError = error.error.message;
                    } else {
                        this.loginError = 'Server Error. Please try again later.';
                    }
                    this.loader = false;
                });
    }
}
