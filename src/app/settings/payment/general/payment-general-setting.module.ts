import { NgModule } from '@angular/core';

import { PaymentGeneralSettingRoutingModule } from './payment-general-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { PaymentGeneralSettingComponent } from './payment-general-setting.component';

@NgModule({
    imports: [
        MaterialModule,
        PaymentGeneralSettingRoutingModule,
    ],
    declarations: [
        PaymentGeneralSettingComponent,
    ]
})

export class PaymentGeneralSettingModule {}
