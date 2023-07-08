import { NgModule } from '@angular/core';

import { EmployeeGeneralSettingRoutingModule } from './employee-general-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { EmployeeGeneralSettingComponent } from './employee-general-setting.component';
import { AddEmployeeComponent } from './add/add-employee.component';
import { EditEmployeeComponent } from './edit/edit-employee.component';

@NgModule({
    imports: [
        MaterialModule,
        EmployeeGeneralSettingRoutingModule,
    ],
    declarations: [
        EmployeeGeneralSettingComponent,
        AddEmployeeComponent,
        EditEmployeeComponent
    ],
    entryComponents: [
        AddEmployeeComponent,
        EditEmployeeComponent
    ]
})

export class EmployeeGeneralSettingModule {}
