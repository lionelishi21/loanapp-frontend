import { Routes, RouterModule } from '@angular/router';
import { ExpenseCategorySettingComponent } from './expense-category-setting.component';

export const ROUTES: Routes = [
    { path: '', component: ExpenseCategorySettingComponent },
];

export const ExpenseCategorySettingRoutingModule = RouterModule.forChild(ROUTES);
