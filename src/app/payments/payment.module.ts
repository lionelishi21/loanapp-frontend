import { NgModule } from '@angular/core';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import { MaterialModule } from '../shared/material.module';
import { AddPaymentComponent } from './add/add-payment.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { PaymentDetailComponent } from './details/payment-detail.component';

@NgModule({
    imports: [
        MaterialModule,
        PaymentRoutingModule,
        MatMomentDateModule
    ],
    declarations: [
        PaymentComponent,
        AddPaymentComponent,
        PaymentDetailComponent
    ],
    entryComponents: [
        AddPaymentComponent,
        PaymentDetailComponent
    ]
})

export class PaymentModule {}
