import { NgModule } from '@angular/core';

import { UserGeneralSettingRoutingModule } from './user-general-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { UserGeneralSettingComponent } from './user-general-setting.component';
import { AddUserComponent } from './add/add-user.component';
import { EditUserComponent } from './edit/edit-user.component';

@NgModule({
    imports: [
        MaterialModule,
        UserGeneralSettingRoutingModule,
    ],
    declarations: [
        UserGeneralSettingComponent,
        AddUserComponent,
        EditUserComponent
    ],
    entryComponents: [
        AddUserComponent,
        EditUserComponent
    ]
})

export class UserGeneralSettingModule {}
