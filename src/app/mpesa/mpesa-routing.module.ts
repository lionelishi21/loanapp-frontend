import { Routes, RouterModule } from '@angular/router';
import { MpesaComponent } from './mpesa.component';
import { PendingDisbursementsComponent } from './pending-disbursements/pending-disbursements.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { MemberDepositComponent } from './member-deposits/member-deposit.component';
import { CustomSendComponent } from './custom-send/custom-send.component';
import { MpesaSummaryResolverService } from './data/mpesa-summary-resolver.service';

export const ROUTES: Routes = [
    {
        path: '', component: MpesaComponent,
        resolve : { summary: MpesaSummaryResolverService },
        children: [
            { path: '', component: PendingDisbursementsComponent},
            { path: 'transactions', component: TransactionsComponent },
            { path: 'member_deposits', component: MemberDepositComponent },
            { path: 'custom_send', component: CustomSendComponent },
        ]
    }
];
export const MpesaRoutingModule = RouterModule.forChild(ROUTES);
