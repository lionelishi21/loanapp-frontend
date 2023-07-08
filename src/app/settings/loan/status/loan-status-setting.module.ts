import { NgModule } from '@angular/core';

import { LoanStatusSettingRoutingModule } from './loan-status-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { LoanStatusSettingComponent } from './loan-status-setting.component';
import { AddLoanStatusComponent } from './add/add-loan-status.component';
import { EditLoanStatusComponent } from './edit/edit-loan-status.component';

@NgModule({
    imports: [
        MaterialModule,
        LoanStatusSettingRoutingModule,
    ],
    declarations: [
        LoanStatusSettingComponent,
        AddLoanStatusComponent,
        EditLoanStatusComponent
    ],
    entryComponents: [
        AddLoanStatusComponent,
        EditLoanStatusComponent
    ]
})

export class LoanStatusSettingModule {}
