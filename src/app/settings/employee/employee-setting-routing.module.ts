import { Routes, RouterModule } from '@angular/router';
import { EmployeeSettingComponent } from './employee-setting.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: EmployeeSettingComponent,
        children: [
            {
                path: '',
                loadChildren: 'app/settings/employee/general/employee-general-setting.module#EmployeeGeneralSettingModule'
            }
        ]
    }
];

export const EmployeeSettingRoutingModule = RouterModule.forChild(ROUTES);
