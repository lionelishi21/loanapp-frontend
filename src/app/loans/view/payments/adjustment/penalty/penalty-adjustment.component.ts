import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TransactionDataSource } from '../../../../../transactions/data/transaction-data.source';
import { PaymentService } from '../../../../../payments/data/payment.service';
import { TransactionService } from '../../../../../transactions/data/transaction.service';
import { PaymentMethodSettingService } from '../../../../../settings/payment/method/data/payment-method-setting.service';
import { LoanPenaltyModel } from '../../../../data/penalty/loan-penalty-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { LoanPenaltyService } from '../../../../data/penalty/loan-penalty.service';
import { NotificationService } from '../../../../../shared/notification.service';


@Component({
    selector: 'app-penalty-transaction',
    styles: [],
    templateUrl: './penalty-adjustment.component.html'
})
export class PenaltyAdjustmentComponent implements OnInit, AfterViewInit  {

    transactionColumns = [
        'transaction_date',
        'amount',
        'payment_method',
        'receipt_number',
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

    penalty: LoanPenaltyModel;
    form: FormGroup;
    formErrors: any;

    waiver: any;
    disable = false;

    loader = false;
    paymentMethods: any = [];

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private loanPenaltyService: LoanPenaltyService,
                private notification: NotificationService,
                private paymentService: PaymentService,
                private transactionService: TransactionService,
                private paymentMethodService: PaymentMethodSettingService,
                private dialogRef: MatDialogRef<PenaltyAdjustmentComponent>) {

        this.penalty = row.data;

        if(this.penalty.balance <= '0'){
            this.disable = true;
        }
    }

    ngOnInit() {

        this.form = this.fb.group({
            amount: [this.penalty.amount, [Validators.required,
                Validators.minLength(3)]],
            paid_amount: [this.penalty.paid_amount, [Validators.required,
                Validators.minLength(1)]],
            waiver_amount: [{value: this.penalty.balance, disabled: this.disable}, [Validators.required,
                Validators.minLength(1)]],

        });

        this.transactionDataSource = new TransactionDataSource(this.transactionService);
        // Load pagination data
        this.transactionDataSource.meta$.subscribe((res) => this.meta = res);
        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.transactionDataSource.load('', 0, 0, 'transaction_date', 'desc', 'loan_penalties_id', this.penalty.id);

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
            'loan_penalties_id', this.penalty.id
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

    /**
     *
     */
    penaltyWaiver(){
        const body = Object.assign({}, this.waiver, this.form.value);
        body.id = this.penalty.id;
        body.loan_id = this.penalty.loan_id;
        body.loan = this.penalty.loan;
        body.balance = this.penalty.balance;

        this.loader = true;
        this.loanPenaltyService.waive(body)
            .subscribe((data) => {
                    this.loader = false;

                    this.dialogRef.close(this.form.value);

                    // notify success
                    this.notification.showNotification('success', 'Success !! Penalty Waived successfully.');

                },
                (error) => {
                    this.loader = false;
                  //  console.log('Error at edit penalty waiver: ', error);

                    if (error.member === 0) {
                        // notify error
                        return;
                    }
                    // An array of all form errors as returned by server
                    this.formErrors = error;

                    if (this.formErrors) {
                        // loop through from fields, If has an error, mark as invalid so mat-error can show
                        for (const prop in this.formErrors) {
                            if (this.form) {
                                this.form.controls[prop].setErrors({incorrect: true});
                            }
                        }
                    }
                });

    }

}
