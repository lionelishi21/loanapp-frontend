import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApplicationGuarantorService } from '../../../members/view/payment/data/application-guarantor.service';
import { NotificationService } from '../../../shared/notification.service';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort } from '@angular/material';
import { LoanService } from '../../data/loan.service';
import { TransactionDataSource } from '../../../transactions/data/transaction-data.source';
import { PaymentModel } from '../../../payments/models/payment-model';
import { TransactionService } from '../../../transactions/data/transaction.service';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { LoanPenaltyDataSource } from '../../data/penalty/loan-penalty-data.source';
import { LoanPenaltyService } from '../../data/penalty/loan-penalty.service';
import { LoanInterestDataSource } from '../../data/interest/loan-interest-data.source';
import { LoanPrincipalDataSource } from '../../data/principal/loan-principal-data.source';
import { LoanInterestService } from '../../data/interest/loan-interest.service';
import { LoanPrincipalService } from '../../data/principal/loan-principal.service';
import { LoanInterestModel } from '../../data/interest/loan-interest-model';
import { InterestTransactionComponent } from './transactions/interest-transaction.component';
import { LoanPrincipalModel } from '../../data/principal/loan-principal-model';
import { LoanPenaltyModel } from '../../data/penalty/loan-penalty-model';
import { PrincipalTransactionComponent } from './transactions/principal/principal-transaction.component';
import { PenaltyTransactionComponent } from './transactions/penalty/penalty-transaction.component';
import { PenaltyAdjustmentComponent } from './adjustment/penalty/penalty-adjustment.component';

@Component({
    selector: 'app-view-loan-payment',
    templateUrl: './view-loan-payments.component.html',
    styleUrls: ['./view-loan-payments.component.css']
})
export class ViewLoanPaymentsComponent implements OnInit, AfterViewInit {

    penaltiesColumns = [
        'loan_id',
        'amount',
        'balance',
        'due_date',
        'actions'
    ];

    interestColumns = [
        'loan_id',
        'amount',
        'balance',
        'due_date',
        'actions'
    ];

    principalColumns = [
        'loan_id',
        'amount',
        'balance',
        'due_date',
        'actions'
    ];

    penaltiesDataSource: LoanPenaltyDataSource;
    interestDataSource: LoanInterestDataSource;
    principalDataSource: LoanPrincipalDataSource;


    // Data for the list table display
    transactionDataSource: TransactionDataSource;
    // pagination
    @ViewChild(MatPaginator, {static: true }) paginator: MatPaginator;

    // Pagination
    length: number;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    meta: any;

    penaltyMeta: any;
    interestMeta: any;
    principalMeta: any;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    payment: PaymentModel;
    loader = false;

    loanData: any;
    loanId = '';
    loanData$: any;

    constructor(private service: ApplicationGuarantorService,  private transactionService: TransactionService,
                private notification: NotificationService, private penaltyService: LoanPenaltyService,
                private interestService: LoanInterestService, private principalService: LoanPrincipalService,
                private dialog: MatDialog, private loanService: LoanService) {}

    ngOnInit() {

        this.loanData$ = this.loanService.selectedLoanChanges$;
        this.loanService.selectedLoanChanges$.subscribe(data => {

            if (data) {
                this.loanData = data;
                this.loanId = data.id;
            }
        });

        // Penalties
        this.penaltiesDataSource = new LoanPenaltyDataSource(this.penaltyService);
        this.penaltiesDataSource.meta$.subscribe((res) => this.penaltyMeta = res);
        this.penaltiesDataSource.load('', 0, 0, 'due_date', 'desc', 'loan_id', this.loanId);

        // Interest
        this.interestDataSource = new LoanInterestDataSource(this.interestService);
        this.interestDataSource.meta$.subscribe((res) => this.interestMeta = res);
        this.interestDataSource.load('', 0, 0, 'due_date', 'desc', 'loan_id', this.loanId);

        // Principal
        this.principalDataSource = new LoanPrincipalDataSource(this.principalService);
        this.principalDataSource.meta$.subscribe((res) => this.principalMeta = res);
        this.principalDataSource.load('', 0, 0, 'due_date', 'desc', 'loan_id', this.loanId);
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
            'loan_id', this.loanId
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
     * @param data
     */
    principalTransactionDetails(data: LoanPrincipalModel) {
        const id = data.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {data};

        const dialogRef = this.dialog.open(PrincipalTransactionComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    //  this.loadData();
                }
            }
        );
    }

    /**
     *
     * @param data
     */
    interestTransactionDetails(data: LoanInterestModel) {
        const id = data.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {data};

        const dialogRef = this.dialog.open(InterestTransactionComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    //  this.loadData();
                }
            }
        );
    }

    /**
     *
     * @param data
     */
    penaltyTransactionDetails(data: LoanPenaltyModel) {
        const id = data.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {data};

        const dialogRef = this.dialog.open(PenaltyTransactionComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    //  this.loadData();
                }
            }
        );
    }

    /**
     *
     * @param data
     */
    penaltyAdjustment(data: LoanPenaltyModel) {
        const id = data.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {data};

        const dialogRef = this.dialog.open(PenaltyAdjustmentComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    //  this.loadData();
                }
            }
        );
    }

}
