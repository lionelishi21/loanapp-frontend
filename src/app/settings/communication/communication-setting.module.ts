import { NgModule } from '@angular/core';

import { CommunicationSettingRoutingModule } from './communication-setting-routing.module';
import { MaterialModule } from '../../shared/material.module';
import { CommunicationSettingComponent } from './communication-setting.component';

@NgModule({
    imports: [
        MaterialModule,
        CommunicationSettingRoutingModule,
    ],
    declarations: [
        CommunicationSettingComponent,
    ]
})

export class CommunicationSettingModule {}
