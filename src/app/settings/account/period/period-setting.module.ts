import { NgModule } from '@angular/core';

import { PeriodSettingRoutingModule } from './period-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { PeriodSettingComponent } from './period-setting.component';
import { AddPeriodComponent } from './add/add-period.component';
import { EditPeriodComponent } from './edit/edit-period.component';

@NgModule({
    imports: [
        MaterialModule,
        PeriodSettingRoutingModule,
    ],
    declarations: [
        PeriodSettingComponent,
        AddPeriodComponent,
        EditPeriodComponent
    ],
    entryComponents: [
        AddPeriodComponent,
        EditPeriodComponent
    ]
})

export class PeriodSettingModule {}
