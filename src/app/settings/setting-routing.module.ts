import { Routes, RouterModule } from '@angular/router';
import { SettingComponent } from './setting.component';
import { GeneralSettingResolverService } from './general/data/general-setting-resolver.service';
export const ROUTES: Routes = [
    {
        path: '',
        component: SettingComponent,
        children: [
            {
                path: '',
                loadChildren: 'app/settings/general/general-setting.module#GeneralSettingModule',
                resolve : { setting: GeneralSettingResolverService}
            },
            {
                path: 'account',
                loadChildren: 'app/settings/account/account-setting.module#AccountSettingModule'
            },
            {
                path: 'borrower',
                loadChildren: 'app/settings/borrower/borrower-setting.module#BorrowerSettingModule'
            },
            {
                path: 'branch',
                loadChildren: 'app/settings/branch/branch-setting.module#BranchSettingModule'
            },
            {
                path: 'employee',
                loadChildren: 'app/settings/employee/employee-setting.module#EmployeeSettingModule'
            },
            {
                path: 'general',
                loadChildren: 'app/settings/general/general-setting.module#GeneralSettingModule'
            },
            {
                path: 'loan',
                loadChildren: 'app/settings/loan/loan-setting.module#LoanSettingModule'
            },
            {
                path: 'communication',
                loadChildren: 'app/settings/communication/communication-setting.module#CommunicationSettingModule'
            },
            {
                path: 'expense',
                loadChildren: 'app/settings/expense/expense-setting.module#ExpenseSettingModule'
            },
            {
                path: 'payment',
                loadChildren: 'app/settings/payment/payment-setting.module#PaymentSettingModule'
            },
            {
                path: 'user',
                loadChildren: 'app/settings/user/user-setting.module#UserSettingModule',
            }
        ]
    }
];

export const SettingRoutingModule = RouterModule.forChild(ROUTES);
