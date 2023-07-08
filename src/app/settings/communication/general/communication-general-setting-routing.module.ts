import { Routes, RouterModule } from '@angular/router';
import { CommunicationGeneralSettingComponent } from './communication-general-setting.component';

export const ROUTES: Routes = [
    { path: '', component: CommunicationGeneralSettingComponent },
];

export const CommunicationGeneralSettingRoutingModule = RouterModule.forChild(ROUTES);
