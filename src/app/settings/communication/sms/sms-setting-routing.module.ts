import { Routes, RouterModule } from '@angular/router';
import { SmsSettingComponent } from './sms-setting.component';

export const ROUTES: Routes = [
    { path: '', component: SmsSettingComponent },
];

export const SmsSettingRoutingModule = RouterModule.forChild(ROUTES);
