import { Routes, RouterModule } from '@angular/router';
import { PeriodSettingComponent } from './period-setting.component';

export const ROUTES: Routes = [
    { path: '', component: PeriodSettingComponent },
];

export const PeriodSettingRoutingModule = RouterModule.forChild(ROUTES);
