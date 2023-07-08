import { NgModule } from '@angular/core';

import { LoanTypeSettingRoutingModule } from './loan-type-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { LoanTypeSettingComponent } from './loan-type-setting.component';
import { AddLoanTypeComponent } from './add/add-loan-type.component';
import { EditLoanTypeComponent } from './edit/edit-loan-type.component';

@NgModule({
    imports: [
        MaterialModule,
        LoanTypeSettingRoutingModule,
    ],
    declarations: [
        LoanTypeSettingComponent,
        AddLoanTypeComponent,
        EditLoanTypeComponent
    ],
    entryComponents: [
        AddLoanTypeComponent,
        EditLoanTypeComponent
    ]
})

export class LoanTypeSettingModule {}
