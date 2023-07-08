import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../shared/delete/confirmation-dialog-component';
import { GuarantorService } from './data/guarantor.service';
import { AddGuarantorComponent } from './add/add-guarantor.component';
import { GuarantorModel } from './models/guarantor-model';
import { EditGuarantorComponent } from './edit/edit-guarantor.component';
import { GuarantorDataSource } from './data/guarantor-data.source';
import { NotificationService } from '../shared/notification.service';
import { MemberService } from '../members/data/member.service';
import { LoanService } from '../loans/data/loan.service';

@Component({
    selector: 'app-guarantors',
    templateUrl: './guarantor.component.html',
    styleUrls: ['./guarantor.component.css']
})
export class GuarantorComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'member_id',
        'loan_id',
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
    dataSource: GuarantorDataSource;

    members: any = [];
    loans: any = [];

    constructor(private service: GuarantorService, private notification: NotificationService,
                private dialog: MatDialog, private membersService: MemberService, private loansService: LoanService) {
    }

    /**
     * Initialize data lead
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.dataSource = new GuarantorDataSource(this.service);

        // Load pagination data
        this.dataSource.meta$.subscribe((res) => this.meta = res);

        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.dataSource.load('', 0, 0, 'member_id', 'asc');

        this.membersService.list('first_name')
            .subscribe((res) => this.members = res,
                () => this.members = []
            );

        this.loansService.list('loan_reference')
            .subscribe((res) => this.loans = res,
                () => this.loans = []
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
            loans: this.loans,
            members: this.members
        };

        const dialogRef = this.dialog.open(AddGuarantorComponent, dialogConfig);
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
    editDialog(guarantor: GuarantorModel) {

        const id = guarantor.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {guarantor,
            loans: this.loans,
            members: this.members
        };

        const dialogRef = this.dialog.open(EditGuarantorComponent, dialogConfig);
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
    openConfirmationDialog(lead: GuarantorModel) {

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
    delete(lead: GuarantorModel) {
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


