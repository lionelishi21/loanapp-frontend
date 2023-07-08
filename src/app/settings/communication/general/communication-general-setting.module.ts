import { NgModule } from '@angular/core';

import { CommunicationGeneralSettingRoutingModule } from './communication-general-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { CommunicationGeneralSettingComponent } from './communication-general-setting.component';
import { EditCommunicationGeneralComponent } from './edit/edit-communication-general.component';

@NgModule({
    imports: [
        MaterialModule,
        CommunicationGeneralSettingRoutingModule,
    ],
    declarations: [
        CommunicationGeneralSettingComponent,
        EditCommunicationGeneralComponent
    ],
    entryComponents: [
        EditCommunicationGeneralComponent
    ]
})

export class CommunicationGeneralSettingModule {}
