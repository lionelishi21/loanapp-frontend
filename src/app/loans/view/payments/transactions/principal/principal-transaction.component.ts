import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoanPrincipalModel } from '../../../../data/principal/loan-principal-model';
import { TransactionDataSource } from '../../../../../transactions/data/transaction-data.source';
import { PaymentService } from '../../../../../payments/data/payment.service';
import { TransactionService } from '../../../../../transactions/data/transaction.service';
import { PaymentMethodSettingService } from '../../../../../settings/payment/method/data/payment-method-setting.service';

@Component({
    selector: 'app-principal-transaction',
    styles: [],
    templateUrl: './principal-transaction.component.html'
})
export class PrincipalTransactionComponent implements OnInit, AfterViewInit  {

    transactionColumns = [
        'transaction_date',
        'amount',
        'loan_id'
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

    principal: LoanPrincipalModel;

    loader = false;
    paymentMethods: any = [];

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private paymentService: PaymentService,
                private transactionService: TransactionService,
                private paymentMethodService: PaymentMethodSettingService,
                private dialogRef: MatDialogRef<PrincipalTransactionComponent>) {

        this.principal = row.data;
    }

    ngOnInit() {

        this.transactionDataSource = new TransactionDataSource(this.transactionService);
        // Load pagination data
        this.transactionDataSource.meta$.subscribe((res) => this.meta = res);
        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.transactionDataSource.load('', 0, 0, 'transaction_date', 'desc', 'loan_principal_repayments_id', this.principal.id);

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
            'loan_principal_repayments_id', this.principal.id
        );
    }

    /**
     * Handle search and pagination
     */
    ngAfterViewInit() {
        this.paginator.page.pipe(
            tap(() => this.loadData() )
        ).subscribe();

        // reset the paginator after sorting
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                tap(() => this.loadData())
            )
            .subscribe();
    }

}
