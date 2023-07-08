import { NgModule } from '@angular/core';

import { PaymentStatusSettingRoutingModule } from './payment-status-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { PaymentStatusSettingComponent } from './payment-status-setting.component';
import { AddPaymentStatusComponent } from './add/add-payment-status.component';
import { EditPaymentStatusComponent } from './edit/edit-payment-status.component';

@NgModule({
    imports: [
        MaterialModule,
        PaymentStatusSettingRoutingModule,
    ],
    declarations: [
        PaymentStatusSettingComponent,
        AddPaymentStatusComponent,
        EditPaymentStatusComponent
    ],
    entryComponents: [
        AddPaymentStatusComponent,
        EditPaymentStatusComponent
    ]
})

export class PaymentStatusSettingModule {}
