import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { PaymentModel } from '../models/payment-model';
import { PaymentService } from '../data/payment.service';
import { PaymentMethodSettingService } from '../../settings/payment/method/data/payment-method-setting.service';
import { TransactionDataSource } from '../../transactions/data/transaction-data.source';
import { TransactionService } from '../../transactions/data/transaction.service';

@Component({
    selector: 'app-payment-detail',
    styles: [],
    templateUrl: './payment-detail.component.html'
})
export class PaymentDetailComponent implements OnInit, AfterViewInit  {

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

    payment: PaymentModel;
    loader = false;
    paymentMethods: any = [];

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private paymentService: PaymentService,
                private transactionService: TransactionService,
                private paymentMethodService: PaymentMethodSettingService,
                private dialogRef: MatDialogRef<PaymentDetailComponent>) {

        this.payment = row.data;
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

    /**
     * Fetch data from data lead
     */
    loadData() {
        this.transactionDataSource.load(
            '',
            (this.paginator.pageIndex + 1),
            (this.paginator.pageSize),
            this.sort.active,
            this.sort.direction,
            'payment_id', this.payment.id
        );
    }

    /**
     * Handle search and pagination
     */
    ngAfterViewInit() {
    }

}
