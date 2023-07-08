import { Routes, RouterModule } from '@angular/router';
import { ExpenseComponent } from './expense.component';
import { EditExpenseComponent } from './edit/edit-expense.component';
import { AddExpenseComponent } from './add/add-expense.component';

export const ROUTES: Routes = [
    { path: '', component: ExpenseComponent },
    { path: ':id/edit', component: EditExpenseComponent },
    { path: 'create', component: AddExpenseComponent },
];


export const ExpenseRoutingModule = RouterModule.forChild(ROUTES);
