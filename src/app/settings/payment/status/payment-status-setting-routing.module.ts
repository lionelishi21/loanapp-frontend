import { Routes, RouterModule } from '@angular/router';
import { PaymentStatusSettingComponent } from './payment-status-setting.component';

export const ROUTES: Routes = [
    { path: '', component: PaymentStatusSettingComponent },
];

export const PaymentStatusSettingRoutingModule = RouterModule.forChild(ROUTES);
