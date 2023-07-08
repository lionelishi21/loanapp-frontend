import { NgModule } from '@angular/core';

import { PaymentSettingRoutingModule } from './payment-setting-routing.module';
import { MaterialModule } from '../../shared/material.module';
import { PaymentSettingComponent } from './payment-setting.component';

@NgModule({
    imports: [
        MaterialModule,
        PaymentSettingRoutingModule,
    ],
    declarations: [
        PaymentSettingComponent,
    ]
})

export class PaymentSettingModule {}
