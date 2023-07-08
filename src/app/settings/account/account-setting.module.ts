import { NgModule } from '@angular/core';

import { AccountSettingRoutingModule } from './account-setting-routing.module';
import { MaterialModule } from '../../shared/material.module';
import { AccountSettingComponent } from './account-setting.component';

@NgModule({
    imports: [
        MaterialModule,
        AccountSettingRoutingModule,
    ],
    declarations: [
        AccountSettingComponent,
    ]
})

export class AccountSettingModule {}
