import { NgModule } from '@angular/core';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting.component';
import { MaterialModule } from '../shared/material.module';

@NgModule({
    imports: [
        MaterialModule,
        SettingRoutingModule,
    ],
    declarations: [
        SettingComponent,
    ]
})

export class SettingModule {}
