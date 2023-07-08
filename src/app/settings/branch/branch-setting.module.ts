import { NgModule } from '@angular/core';

import { BranchSettingRoutingModule } from './branch-setting-routing.module';
import { MaterialModule } from '../../shared/material.module';
import { BranchSettingComponent } from './branch-setting.component';

@NgModule({
    imports: [
        MaterialModule,
        BranchSettingRoutingModule,
    ],
    declarations: [
        BranchSettingComponent,
    ]
})

export class BranchSettingModule {}
