import { Routes, RouterModule } from '@angular/router';
import { LoanSettingComponent } from './loan-setting.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: LoanSettingComponent,
        children: [
            {
                path: '',
                loadChildren: 'app/settings/loan/type/loan-type-setting.module#LoanTypeSettingModule'
            },
           {
                path: 'type',
                loadChildren: 'app/settings/loan/type/loan-type-setting.module#LoanTypeSettingModule'
            },
            {
                path: 'status',
                loadChildren: 'app/settings/loan/status/loan-status-setting.module#LoanStatusSettingModule'
            },
            {
                path: 'interest_type',
                loadChildren: 'app/settings/loan/interest-type/interest-type-setting.module#InterestTypeSettingModule'
            },
            {
                path: 'payment_frequency',
                loadChildren: 'app/settings/loan/payment-frequency/payment-frequency-setting.module#PaymentFrequencySettingModule'
            }
        ]
    }
];

export const LoanSettingRoutingModule = RouterModule.forChild(ROUTES);
