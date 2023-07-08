import { Routes, RouterModule } from '@angular/router';
import { BranchSettingComponent } from './branch-setting.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: BranchSettingComponent,
        children: [
            {
                path: '',
                loadChildren: 'app/settings/branch/general/branch-general-setting.module#BranchGeneralSettingModule'
            }
        ]
    }
];

export const BranchSettingRoutingModule = RouterModule.forChild(ROUTES);
