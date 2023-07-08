import { NgModule } from '@angular/core';

import { LoanSourceSettingRoutingModule } from './loan-source-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { LoanSourceSettingComponent } from './loan-source-setting.component';
import { AddLoanSourceComponent } from './add/add-loan-source.component';
import { EditLoanSourceComponent } from './edit/edit-loan-source.component';

@NgModule({
    imports: [
        MaterialModule,
        LoanSourceSettingRoutingModule,
    ],
    declarations: [
        LoanSourceSettingComponent,
        AddLoanSourceComponent,
        EditLoanSourceComponent
    ],
    entryComponents: [
        AddLoanSourceComponent,
        EditLoanSourceComponent
    ]
})

export class LoanSourceSettingModule {}
