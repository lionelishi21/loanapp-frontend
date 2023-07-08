import { Routes, RouterModule } from '@angular/router';
import { SmsTemplateSettingComponent } from './sms-template-setting.component';

export const ROUTES: Routes = [
    { path: '', component: SmsTemplateSettingComponent },
];

export const SmsTemplateSettingRoutingModule = RouterModule.forChild(ROUTES);
