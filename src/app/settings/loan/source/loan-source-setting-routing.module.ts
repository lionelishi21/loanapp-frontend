import { Routes, RouterModule } from '@angular/router';
import { LoanSourceSettingComponent } from './loan-source-setting.component';

export const ROUTES: Routes = [
    { path: '', component: LoanSourceSettingComponent },
];

export const LoanSourceSettingRoutingModule = RouterModule.forChild(ROUTES);
