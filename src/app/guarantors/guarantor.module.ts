import { NgModule } from '@angular/core';

import { GuarantorRoutingModule } from './guarantor-routing.module';
import { GuarantorComponent } from './guarantor.component';
import { MaterialModule } from '../shared/material.module';
import { EditGuarantorComponent } from './edit/edit-guarantor.component';
import { AddGuarantorComponent } from './add/add-guarantor.component';

@NgModule({
    imports: [
        MaterialModule,
        GuarantorRoutingModule,
    ],
    declarations: [
        GuarantorComponent,
        EditGuarantorComponent,
        AddGuarantorComponent
    ],
    entryComponents: [
        EditGuarantorComponent,
        AddGuarantorComponent
    ]
})

export class GuarantorModule {}
