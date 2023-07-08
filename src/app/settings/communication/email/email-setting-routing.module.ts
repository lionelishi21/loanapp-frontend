import { Routes, RouterModule } from '@angular/router';
import { EmailSettingComponent } from './email-setting.component';

export const ROUTES: Routes = [
    { path: '', component: EmailSettingComponent },
];

export const EmailSettingRoutingModule = RouterModule.forChild(ROUTES);
