import { NgModule } from '@angular/core';

import { EmployeeSettingRoutingModule } from './employee-setting-routing.module';
import { MaterialModule } from '../../shared/material.module';
import { EmployeeSettingComponent } from './employee-setting.component';

@NgModule({
    imports: [
        MaterialModule,
        EmployeeSettingRoutingModule,
    ],
    declarations: [
        EmployeeSettingComponent,
    ]
})

export class EmployeeSettingModule {}
