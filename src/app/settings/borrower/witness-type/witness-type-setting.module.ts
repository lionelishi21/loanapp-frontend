import { NgModule } from '@angular/core';

import { WitnessTypeSettingRoutingModule } from './witness-type-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { WitnessTypeSettingComponent } from './witness-type-setting.component';
import { AddWitnessTypeComponent } from './add/add-witness-type.component';
import { EditWitnessTypeComponent } from './edit/edit-witness-type.component';

@NgModule({
    imports: [
        MaterialModule,
        WitnessTypeSettingRoutingModule,
    ],
    declarations: [
        WitnessTypeSettingComponent,
        AddWitnessTypeComponent,
        EditWitnessTypeComponent
    ],
    entryComponents: [
        AddWitnessTypeComponent,
        EditWitnessTypeComponent
    ]
})

export class WitnessTypeSettingModule {}
