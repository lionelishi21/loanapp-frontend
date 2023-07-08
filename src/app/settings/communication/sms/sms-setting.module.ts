import { NgModule } from '@angular/core';

import { SmsSettingRoutingModule } from './sms-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { SmsSettingComponent } from './sms-setting.component';

@NgModule({
    imports: [
        MaterialModule,
        SmsSettingRoutingModule,
    ],
    declarations: [
        SmsSettingComponent,
    ],
    entryComponents: [
    ]
})

export class SmsSettingModule {}
