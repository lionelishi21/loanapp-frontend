import { Routes, RouterModule } from '@angular/router';
import { BorrowerStatusSettingComponent } from './borrower-status-setting.component';

export const ROUTES: Routes = [
    { path: '', component: BorrowerStatusSettingComponent },
];

export const BorrowerStatusSettingRoutingModule = RouterModule.forChild(ROUTES);
