import { NgModule } from '@angular/core';

import { WithdrawalRoutingModule } from './withdrawal-routing.module';
import { WithdrawalComponent } from './withdrawal.component';
import { MaterialModule } from '../shared/material.module';
import { AddWithdrawalComponent } from './add/add-withdrawal.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { WithdrawalDetailComponent } from './details/withdrawal-detail.component';

@NgModule({
    imports: [
        MaterialModule,
        WithdrawalRoutingModule,
        MatMomentDateModule
    ],
    declarations: [
        WithdrawalComponent,
        AddWithdrawalComponent,
        WithdrawalDetailComponent
    ],
    entryComponents: [
        AddWithdrawalComponent,
        WithdrawalDetailComponent
    ]
})

export class WithdrawalModule {}
