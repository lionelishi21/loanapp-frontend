import { Routes, RouterModule } from '@angular/router';
import { WithdrawalComponent } from './withdrawal.component';
import { AddWithdrawalComponent } from './add/add-withdrawal.component';

export const ROUTES: Routes = [
    { path: '', component: WithdrawalComponent },
    { path: 'create', component: AddWithdrawalComponent },
];

export const WithdrawalRoutingModule = RouterModule.forChild(ROUTES);
