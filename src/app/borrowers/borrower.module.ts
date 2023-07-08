import { NgModule } from '@angular/core';

import { BorrowerRoutingModule } from './borrower-routing.module';
import { BorrowerComponent } from './borrower.component';
import { MaterialModule } from '../shared/material.module';
import { EditBorrowerComponent } from './edit/edit-borrower.component';
import { AddBorrowerComponent } from './add/add-borrower.component';

@NgModule({
    imports: [
        MaterialModule,
        BorrowerRoutingModule,
    ],
    declarations: [
        BorrowerComponent,
        EditBorrowerComponent,
        AddBorrowerComponent
    ],
    entryComponents: [
        EditBorrowerComponent,
        AddBorrowerComponent
    ]
})

export class BorrowerModule {}
