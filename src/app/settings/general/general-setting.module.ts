import { NgModule } from '@angular/core';

import { GeneralSettingRoutingModule } from './general-setting-routing.module';
import { GeneralSettingComponent } from './general-setting.component';
import { MaterialModule } from '../../shared/material.module';


@NgModule({
    imports: [
        MaterialModule,
        GeneralSettingRoutingModule,
    ],
    declarations: [
        GeneralSettingComponent,
    ]
})

export class GeneralSettingModule {}
