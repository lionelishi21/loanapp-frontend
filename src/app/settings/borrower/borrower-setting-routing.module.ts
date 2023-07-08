import { Routes, RouterModule } from '@angular/router';
import { BorrowerSettingComponent } from './borrower-setting.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: BorrowerSettingComponent,
        children: [
            {
                path: '',
                loadChildren: 'app/settings/borrower/witness-type/witness-type-setting.module#WitnessTypeSettingModule'
            },
            {
                path: 'status',
                loadChildren: 'app/settings/borrower/status/borrower-status-setting.module#BorrowerStatusSettingModule'
            }
        ]
    }
];

export const BorrowerSettingRoutingModule = RouterModule.forChild(ROUTES);
