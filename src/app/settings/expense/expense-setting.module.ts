import { NgModule } from '@angular/core';

import { ExpenseSettingRoutingModule } from './expense-setting-routing.module';
import { MaterialModule } from '../../shared/material.module';
import { ExpenseSettingComponent } from './expense-setting.component';

@NgModule({
    imports: [
        MaterialModule,
        ExpenseSettingRoutingModule,
    ],
    declarations: [
        ExpenseSettingComponent,
    ]
})

export class ExpenseSettingModule {}
