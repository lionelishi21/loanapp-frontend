import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { ConfirmationDialogComponent } from '../../shared/delete/confirmation-dialog-component';
import { ScheduledDisbursementDataSource } from '../data/scheduled-disbursement-data.source';
import { FormBuilder, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { NotificationService } from '../../shared/notification.service';
import { MemberService } from '../../members/data/member.service';
import { BranchService } from '../../settings/branch/general/data/branch.service';
import { branch } from '../../auth/auth.selectors';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BulkPaymentsService } from '../data/bulk-payments.service';
import { BulkPaymentsDataSource } from '../data/bulk-payments-data.source';

@Component({
    selector: 'app-mpesa-transaction',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements  OnInit, AfterViewInit {

    displayColumns = [
        'transaction_amount',
        'transaction_receipt',
        'b2C_recipientIs_registered_customer',
        'b2C_charges_paid_account_available_funds',
        'receiver_party_public_name',
        'transaction_completed_date_time',
    ];

    loader = false;

    dialogRef: MatDialogRef<ConfirmationDialogComponent>;

    // Search field
    @ViewChild('search', {static: false}) search: ElementRef;

    // pagination
    @ViewChild(MatPaginator, {static: true }) paginator: MatPaginator;

    // Pagination
    length: number;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    meta: any;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    // Data for the list table display
    dataSourceTransactions: ScheduledDisbursementDataSource;

    members: any;
    branches: any;
    branchId: any;

    form: FormGroup;

    constructor(private fb: FormBuilder, private transactionsService: BulkPaymentsService,
                private store: Store<AppState>, private notification: NotificationService, private dialog: MatDialog,
                private memberService: MemberService, private branchService: BranchService) {
        this.store.pipe(select(branch)).subscribe(user => this.branchId = user);
    }

    /**
     * Initialize data lead
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.dataSourceTransactions = new BulkPaymentsDataSource(this.transactionsService);

        // Load pagination data
        this.dataSourceTransactions.meta$.subscribe((res) => this.meta = res);

        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.dataSourceTransactions.load('', 0, 0, 'created_at', 'desc', '', '');

        this.branchService.list(['name'])
            .subscribe((res) => this.branches = res,
                () => this.branches = []
            );

        this.form = this.fb.group({
            branch_id: [this.branchId]
        });

    }

    /**
     *
     * @param value
     */
    onBranchChange(value) {
        this.branchId = value;
        this.loadData();
    }

    /**
     * Fetch data from data lead
     */
    loadData() {
        this.dataSourceTransactions.load(
            this.search.nativeElement.value,
            (this.paginator.pageIndex + 1),
            (this.paginator.pageSize),
            this.sort.active,
            this.sort.direction,
            '',
            ''
        );
    }

    /**
     * Handle search and pagination
     */
    ngAfterViewInit() {

        fromEvent(this.search.nativeElement, 'keyup')
            .pipe(
                debounceTime(1000),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.loadData();
                })
            ).subscribe();

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
     * Empty search box
     */
    clearSearch() {
        this.search.nativeElement.value = '';
        this.loadData()
    }
}
