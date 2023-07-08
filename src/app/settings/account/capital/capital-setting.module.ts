import { NgModule } from '@angular/core';

import { CapitalSettingRoutingModule } from './capital-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { CapitalSettingComponent } from './capital-setting.component';
import { AddCapitalComponent } from './add/add-capital.component';
import { EditCapitalComponent } from './edit/edit-capital.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
    imports: [
        MaterialModule,
        CapitalSettingRoutingModule,
        MatMomentDateModule
    ],
    declarations: [
        CapitalSettingComponent,
        AddCapitalComponent,
        EditCapitalComponent
    ],
    entryComponents: [
        AddCapitalComponent,
        EditCapitalComponent
    ]
})

export class CapitalSettingModule {}
