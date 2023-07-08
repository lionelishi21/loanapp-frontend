import { NgModule } from '@angular/core';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from '../shared/material.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { Error404Component } from './404/error-404.component';
import { Error500Component } from './500/error-500.component';
import { StoreModule } from '@ngrx/store';
import * as fromAuth from './auth.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth.effects';
import { RequirementsComponent } from '../install/requirements/requirements.component';
import { InstallStartComponent } from '../install/install-start.component';
import { InstallComponent } from '../install/install.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
    imports: [
        AuthenticationRoutingModule,
        MaterialModule,
        StoreModule.forFeature('auth', fromAuth.authReducer),
        EffectsModule.forFeature([AuthEffects])
    ],
    declarations: [
        LoginComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        ConfirmEmailComponent,
        Error404Component,
        Error500Component,
        InstallStartComponent,
        RequirementsComponent,
        InstallComponent
    ],
    providers: [],
})

export class AuthenticationModule {}
