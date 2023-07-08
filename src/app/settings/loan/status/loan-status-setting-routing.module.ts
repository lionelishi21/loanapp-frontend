import { Routes, RouterModule } from '@angular/router';
import { LoanStatusSettingComponent } from './loan-status-setting.component';

export const ROUTES: Routes = [
    { path: '', component: LoanStatusSettingComponent },
];

export const LoanStatusSettingRoutingModule = RouterModule.forChild(ROUTES);
