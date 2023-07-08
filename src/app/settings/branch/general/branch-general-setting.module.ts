import { NgModule } from '@angular/core';

import { BranchGeneralSettingRoutingModule } from './branch-general-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { BranchGeneralSettingComponent } from './branch-general-setting.component';
import { AddBranchComponent } from './add/add-branch.component';
import { EditBranchComponent } from './edit/edit-branch.component';

@NgModule({
    imports: [
        MaterialModule,
        BranchGeneralSettingRoutingModule,
    ],
    declarations: [
        BranchGeneralSettingComponent,
        AddBranchComponent,
        EditBranchComponent
    ],
    entryComponents: [
        AddBranchComponent,
        EditBranchComponent
    ]
})

export class BranchGeneralSettingModule {}
