import { NgModule } from '@angular/core';

import { PaymentMethodSettingRoutingModule } from './payment-method-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { PaymentMethodSettingComponent } from './payment-method-setting.component';
import { AddPaymentMethodComponent } from './add/add-payment-method.component';
import { EditPaymentMethodComponent } from './edit/edit-payment-method.component';

@NgModule({
    imports: [
        MaterialModule,
        PaymentMethodSettingRoutingModule,
    ],
    declarations: [
        PaymentMethodSettingComponent,
        AddPaymentMethodComponent,
        EditPaymentMethodComponent
    ],
    entryComponents: [
        AddPaymentMethodComponent,
        EditPaymentMethodComponent
    ]
})

export class PaymentMethodSettingModule {}
