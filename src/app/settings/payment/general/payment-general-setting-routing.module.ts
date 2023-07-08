import { Routes, RouterModule } from '@angular/router';
import { PaymentGeneralSettingComponent } from './payment-general-setting.component';

export const ROUTES: Routes = [
    { path: '', component: PaymentGeneralSettingComponent },
];

export const PaymentGeneralSettingRoutingModule = RouterModule.forChild(ROUTES);
