import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { AuthenticationModule } from './auth/authentication.module';
import { EffectsModule } from '@ngrx/effects';
import { JwtInterceptor } from './auth/jwt.interceptor';
import { ErrorInterceptor } from './auth/error.interceptor';
import { MaterialModule } from './shared/material.module';
import { AppPreloadingStrategy } from './app-preloading-strategy';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    AuthenticationModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    NgxMatSelectSearchModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    AppPreloadingStrategy
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
