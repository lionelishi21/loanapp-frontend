import { Routes, RouterModule } from '@angular/router';
import { ExpenseSettingComponent } from './expense-setting.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: ExpenseSettingComponent,
        children: [
            {
                path: '',
                loadChildren: 'app/settings/expense/expense_category/expense-category-setting.module#ExpenseCategorySettingModule'
            },
           {
                path: 'expense_category',
                loadChildren: 'app/settings/expense/expense_category/expense-category-setting.module#ExpenseCategorySettingModule'
            }
        ]
    }
];

export const ExpenseSettingRoutingModule = RouterModule.forChild(ROUTES);
