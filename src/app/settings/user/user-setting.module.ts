import { NgModule } from '@angular/core';

import { UserSettingRoutingModule } from './user-setting-routing.module';
import { MaterialModule } from '../../shared/material.module';
import { UserSettingComponent } from './user-setting.component';

@NgModule({
    imports: [
        MaterialModule,
        UserSettingRoutingModule,
    ],
    declarations: [
        UserSettingComponent,
    ]
})

export class UserSettingModule {}
