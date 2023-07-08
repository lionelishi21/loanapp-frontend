import { Routes, RouterModule } from '@angular/router';
import { CapitalSettingComponent } from './capital-setting.component';

export const ROUTES: Routes = [
    { path: '', component: CapitalSettingComponent },
];

export const CapitalSettingRoutingModule = RouterModule.forChild(ROUTES);
