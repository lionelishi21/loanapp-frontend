import { NgModule } from '@angular/core';

import { EmailSettingRoutingModule } from './email-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { EmailSettingComponent } from './email-setting.component';

@NgModule({
    imports: [
        MaterialModule,
        EmailSettingRoutingModule,
    ],
    declarations: [
        EmailSettingComponent
    ],
    entryComponents: [
    ]
})

export class EmailSettingModule {}
