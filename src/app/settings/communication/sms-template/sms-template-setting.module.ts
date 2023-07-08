import { NgModule } from '@angular/core';

import { SmsTemplateSettingRoutingModule } from './sms-template-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { SmsTemplateSettingComponent } from './sms-template-setting.component';

@NgModule({
    imports: [
        MaterialModule,
        SmsTemplateSettingRoutingModule,
    ],
    declarations: [
        SmsTemplateSettingComponent,
    ],
    entryComponents: [
    ]
})

export class SmsTemplateSettingModule {}
