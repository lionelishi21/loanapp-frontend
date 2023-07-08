import { NgModule } from '@angular/core';

import { InterestTypeSettingRoutingModule } from './interest-type-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { InterestTypeSettingComponent } from './interest-type-setting.component';
import { AddInterestTypeComponent } from './add/add-interest-type.component';
import { EditInterestTypeComponent } from './edit/edit-interest-type.component';

@NgModule({
    imports: [
        MaterialModule,
        InterestTypeSettingRoutingModule,
    ],
    declarations: [
        InterestTypeSettingComponent,
        AddInterestTypeComponent,
        EditInterestTypeComponent
    ],
    entryComponents: [
        AddInterestTypeComponent,
        EditInterestTypeComponent
    ]
})

export class InterestTypeSettingModule {}
