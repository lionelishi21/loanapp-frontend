import { NgModule } from '@angular/core';

import { ExpenseRoutingModule } from './expense-routing.module';
import { ExpenseComponent } from './expense.component';
import { MaterialModule } from '../shared/material.module';
import { EditExpenseComponent } from './edit/edit-expense.component';
import { AddExpenseComponent } from './add/add-expense.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
    imports: [
        MaterialModule,
        ExpenseRoutingModule,
        MatMomentDateModule
    ],
    declarations: [
        ExpenseComponent,
        EditExpenseComponent,
        AddExpenseComponent
    ],
    entryComponents: [
        EditExpenseComponent,
        AddExpenseComponent
    ]
})

export class ExpenseModule {}
