import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { ConfirmationDialogComponent } from '../../shared/delete/confirmation-dialog-component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { NotificationService } from '../../shared/notification.service';
import { MemberService } from '../../members/data/member.service';
import { BranchService } from '../../settings/branch/general/data/branch.service';
import { branch } from '../../auth/auth.selectors';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ScheduledDisbursementService } from '../data/scheduled-disbursement.service';
import { ScheduledDisbursementDataSource } from '../data/scheduled-disbursement-data.source';

@Component({
    selector: 'app-mpesa-pending-disbursement',
    templateUrl: './pending-disbursements.component.html',
    styleUrls: ['./pending-disbursement.component.css']
})
export class PendingDisbursementsComponent implements  OnInit, AfterViewInit {

    displayColumns = [
        'branch_id',
        'mpesa_number',
        'amount',
        'created_by'
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
    dataSourceScheduledDisbursement: ScheduledDisbursementDataSource;

    members: any;
    branches: any;
    branchId: any;

    form: FormGroup;

    constructor(private fb: FormBuilder, private scheduledDisbursementService: ScheduledDisbursementService,
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

        this.dataSourceScheduledDisbursement = new ScheduledDisbursementDataSource(this.scheduledDisbursementService);

        // Load pagination data
        this.dataSourceScheduledDisbursement.meta$.subscribe((res) => this.meta = res);

        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.dataSourceScheduledDisbursement.load('', 0, 0, 'created_at', 'desc', 'branch_id', this.branchId);

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
        this.dataSourceScheduledDisbursement.load(
            this.search.nativeElement.value,
            (this.paginator.pageIndex + 1),
            (this.paginator.pageSize),
            this.sort.active,
            this.sort.direction,
            'branch_id',
            this.branchId
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
