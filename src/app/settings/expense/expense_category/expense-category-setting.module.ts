import { NgModule } from '@angular/core';

import { ExpenseCategorySettingRoutingModule } from './expense-category-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { ExpenseCategorySettingComponent } from './expense-category-setting.component';
import { AddExpenseCategoryComponent } from './add/add-expense-category.component';
import { EditExpenseCategoryComponent } from './edit/edit-expense-category.component';

@NgModule({
    imports: [
        MaterialModule,
        ExpenseCategorySettingRoutingModule,
    ],
    declarations: [
        ExpenseCategorySettingComponent,
        AddExpenseCategoryComponent,
        EditExpenseCategoryComponent
    ],
    entryComponents: [
        AddExpenseCategoryComponent,
        EditExpenseCategoryComponent
    ]
})

export class ExpenseCategorySettingModule {}
