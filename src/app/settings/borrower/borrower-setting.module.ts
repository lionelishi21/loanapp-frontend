import { NgModule } from '@angular/core';

import { BorrowerSettingRoutingModule } from './borrower-setting-routing.module';
import { MaterialModule } from '../../shared/material.module';
import { BorrowerSettingComponent } from './borrower-setting.component';

@NgModule({
    imports: [
        MaterialModule,
        BorrowerSettingRoutingModule,
    ],
    declarations: [
        BorrowerSettingComponent,
    ]
})

export class BorrowerSettingModule {}
