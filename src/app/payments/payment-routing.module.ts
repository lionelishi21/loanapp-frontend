import { Routes, RouterModule } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { AddPaymentComponent } from './add/add-payment.component';

export const ROUTES: Routes = [
    { path: '', component: PaymentComponent },
    { path: 'create', component: AddPaymentComponent },
];

export const PaymentRoutingModule = RouterModule.forChild(ROUTES);
