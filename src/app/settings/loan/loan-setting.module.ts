import { NgModule } from '@angular/core';

import { LoanSettingRoutingModule } from './loan-setting-routing.module';
import { MaterialModule } from '../../shared/material.module';
import { LoanSettingComponent } from './loan-setting.component';

@NgModule({
    imports: [
        MaterialModule,
        LoanSettingRoutingModule,
    ],
    declarations: [
        LoanSettingComponent,
    ]
})

export class LoanSettingModule {}
