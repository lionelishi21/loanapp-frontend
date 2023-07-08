import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { PaymentMethodSettingService } from '../../settings/payment/method/data/payment-method-setting.service';
import { TransactionDataSource } from '../../transactions/data/transaction-data.source';
import { TransactionService } from '../../transactions/data/transaction.service';
import { WithdrawalModel } from '../models/withdrawal-model';
import { WithdrawalService } from '../data/withdrawal.service';

@Component({
    selector: 'app-payment-detail',
    styles: [],
    templateUrl: './withdrawal-detail.component.html'
})
export class WithdrawalDetailComponent implements OnInit  {

    transactionColumns = [
        'loan_id',
        'amount',
        'transaction_date',
        'transaction_type'
    ];

    // Data for the list table display
    transactionDataSource: TransactionDataSource;
    // pagination
    @ViewChild(MatPaginator, {static: true }) paginator: MatPaginator;

    // Pagination
    length: number;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    meta: any;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    withdrawal: WithdrawalModel;
    loader = false;
    paymentMethods: any = [];

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private withdrawalService: WithdrawalService,
                private transactionService: TransactionService,
                private paymentMethodService: PaymentMethodSettingService,
                private dialogRef: MatDialogRef<WithdrawalDetailComponent>) {

        this.withdrawal = row.data;
    }

    ngOnInit() {
        this.paymentMethodService.list('name')
            .subscribe((res) => this.paymentMethods = res,
                () => this.paymentMethods = []
            );
    }

    close() {
        this.dialogRef.close();
    }

}
