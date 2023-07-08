import { NgModule } from '@angular/core';

import { BorrowerStatusSettingRoutingModule } from './borrower-status-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { BorrowerStatusSettingComponent } from './borrower-status-setting.component';
import { AddBorrowerStatusComponent } from './add/add-borrower-status.component';
import { EditBorrowerStatusComponent } from './edit/edit-borrower-status.component';

@NgModule({
    imports: [
        MaterialModule,
        BorrowerStatusSettingRoutingModule,
    ],
    declarations: [
        BorrowerStatusSettingComponent,
        AddBorrowerStatusComponent,
        EditBorrowerStatusComponent
    ],
    entryComponents: [
        AddBorrowerStatusComponent,
        EditBorrowerStatusComponent
    ]
})

export class BorrowerStatusSettingModule {}
