import { Routes, RouterModule } from '@angular/router';
import { LoanTypeSettingComponent } from './loan-type-setting.component';

export const ROUTES: Routes = [
    { path: '', component: LoanTypeSettingComponent },
];

export const LoanTypeSettingRoutingModule = RouterModule.forChild(ROUTES);
