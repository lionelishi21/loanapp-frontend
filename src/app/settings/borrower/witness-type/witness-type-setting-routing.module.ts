import { Routes, RouterModule } from '@angular/router';
import { WitnessTypeSettingComponent } from './witness-type-setting.component';

export const ROUTES: Routes = [
    { path: '', component: WitnessTypeSettingComponent },
];

export const WitnessTypeSettingRoutingModule = RouterModule.forChild(ROUTES);
