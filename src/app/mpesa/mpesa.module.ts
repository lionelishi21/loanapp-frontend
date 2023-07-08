import { NgModule } from '@angular/core';

import { MpesaRoutingModule } from './mpesa-routing.module';
import { MpesaComponent } from './mpesa.component';
import { MaterialModule } from '../shared/material.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { PendingDisbursementsComponent } from './pending-disbursements/pending-disbursements.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { MemberDepositComponent } from './member-deposits/member-deposit.component';
import { CustomSendComponent } from './custom-send/custom-send.component';

@NgModule({
    imports: [
        MaterialModule,
        MpesaRoutingModule,
        MatMomentDateModule
    ],
    declarations: [
        MpesaComponent,
        PendingDisbursementsComponent,
        TransactionsComponent,
        MemberDepositComponent,
        CustomSendComponent
    ],
    entryComponents: [
    ]
})

export class MpesaModule {}
