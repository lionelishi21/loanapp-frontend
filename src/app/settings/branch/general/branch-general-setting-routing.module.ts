import { Routes, RouterModule } from '@angular/router';
import { BranchGeneralSettingComponent } from './branch-general-setting.component';

export const ROUTES: Routes = [
    { path: '', component: BranchGeneralSettingComponent },
];

export const BranchGeneralSettingRoutingModule = RouterModule.forChild(ROUTES);
