import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogComponent } from '../shared/delete/confirmation-dialog-component';
import { BorrowerService } from './data/borrower.service';
import { AddBorrowerComponent } from './add/add-borrower.component';
import { BorrowerModel } from './models/borrower-model';
import { EditBorrowerComponent } from './edit/edit-borrower.component';
import { BorrowerDataSource } from './data/borrower-data.source';
import { NotificationService } from '../shared/notification.service';
import { WitnessTypeSettingService } from '../settings/borrower/witness-type/data/witness-type-setting.service';
import { MemberService } from '../members/data/member.service';
import { BorrowerStatusSettingService } from '../settings/borrower/status/data/borrower-status-setting.service';

@Component({
    selector: 'app-borrowers',
    templateUrl: './borrower.component.html',
    styleUrls: ['./borrower.component.css']
})
export class BorrowerComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'member_id',
        'credit_score',
        'borrower_status_id',
        'witness_type_id',
        'actions'
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
    dataSource: BorrowerDataSource;

    witness_types: any = [];
    members: any = [];
    borrower_statuses: any = [];

    constructor(private service: BorrowerService, private notification: NotificationService,
                private dialog: MatDialog, private witnessTypeService: WitnessTypeSettingService,
                private membersService: MemberService, private borrowerStatusesService: BorrowerStatusSettingService ) {
    }

    /**
     * Initialize data lead
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.dataSource = new BorrowerDataSource(this.service);

        // Load pagination data
        this.dataSource.meta$.subscribe((res) => this.meta = res);

        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.dataSource.load('', 0, 0, 'member_id', 'asc');

        this.witnessTypeService.list('name')
            .subscribe((res) => this.witness_types = res,
                () => this.witness_types = []
            );

        this.membersService.list('first_name')
            .subscribe((res) => this.members = res,
                () => this.members = []
            );

        this.borrowerStatusesService.list('name')
            .subscribe((res) => this.borrower_statuses = res,
                () => this.borrower_statuses = []
            );

    }

    /**
     * Add dialog launch
     */
    addDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {
            witness_types: this.witness_types,
            members: this.members,
            borrower_statuses: this.borrower_statuses
        };

        const dialogRef = this.dialog.open(AddBorrowerComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    this.loadData();
                }
            }
        );
    }

    /**
     * Edit dialog launch
     */
    editDialog(borrower: BorrowerModel) {

        const id = borrower.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {borrower,
            witness_types: this.witness_types,
            members: this.members,
            borrower_statuses: this.borrower_statuses
        };

        const dialogRef = this.dialog.open(EditBorrowerComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    this.loadData();
                }
            }
        );
    }

    /**
     * Fetch data from data lead
     */
    loadData() {
        this.dataSource.load(
            this.search.nativeElement.value,
            (this.paginator.pageIndex + 1),
            (this.paginator.pageSize),
            this.sort.active,
            this.sort.direction
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
            // startWith(null),
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
     * Open Edit form
     * @param lead
     */
    openConfirmationDialog(lead: BorrowerModel) {

        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });

        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.delete(lead);
            }
            this.dialogRef = null;
        });
    }

    /**
     * Remove resource from db
     * @param lead
     */
    delete(lead: BorrowerModel) {
        this.loader = true;
        this.service.delete(lead)
            .subscribe((data) => {
                    this.loader = false;
                    this.loadData();
                    this.notification.showNotification('success', 'Success !! Lead has been deleted.');
                },
                (error) => {
                    this.loader = false;
                    if (!error.error['error']) {
                        this.notification.showNotification('danger', 'Connection Error !! Nothing deleted.' +
                            ' Check Connection and retry. ');
                    } else {
                        this.notification.showNotification('danger', 'Delete Error !! ');
                    }
                });
    }

    /**
     * Empty search box
     */
    clearSearch() {
        this.search.nativeElement.value = '';
        this.loadData()
    }
}


