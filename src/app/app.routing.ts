import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from './auth/auth.guard';
import { AppPreloadingStrategy } from './app-preloading-strategy';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'expenses',
        loadChildren: './expenses/expense.module#ExpenseModule',
        canActivate: [AuthGuard],
        data: { preload: true, delay: false }
      },
      {
        path: 'members',
        loadChildren: './members/member.module#MemberModule',
        data: { preload: true, delay: false }
      },
      {
        path: 'loans',
        loadChildren: './loans/loan.module#LoanModule',
        canActivate: [AuthGuard],
        data: { preload: true, delay: true }
      },
      {
        path: 'loan-applications',
        loadChildren: './loan-applications/loan-application.module#LoanApplicationModule',
        canActivate: [AuthGuard],
        data: { preload: true, delay: true }
      },
      {
        path: 'payments',
        loadChildren: './payments/payment.module#PaymentModule',
        canActivate: [AuthGuard],
        data: { preload: true, delay: true }
      },
      {
        path: 'withdrawals',
        loadChildren: './withdrawals/withdrawal.module#WithdrawalModule',
        canActivate: [AuthGuard],
        data: { preload: true, delay: true }
      },
      {
        path: 'settings',
        loadChildren: './settings/setting.module#SettingModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'mpesa',
        loadChildren: './mpesa/mpesa.module#MpesaModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'reports',
        loadChildren: './accounting/accounting.module#AccountingModule',
        canActivate: [AuthGuard],
        data: { preload: true, delay: true }
      },
      {
        path: 'user-profile',
        loadChildren: './user-profile/user-profile.module#UserProfileModule',
        canActivate: [AuthGuard],
        data: { preload: true, delay: true }
      },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
       useHash: true,
      preloadingStrategy: AppPreloadingStrategy
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
