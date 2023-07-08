import { Routes, RouterModule } from '@angular/router';
import { EmployeeGeneralSettingComponent } from './employee-general-setting.component';

export const ROUTES: Routes = [
    { path: '', component: EmployeeGeneralSettingComponent },
];

export const EmployeeGeneralSettingRoutingModule = RouterModule.forChild(ROUTES);
