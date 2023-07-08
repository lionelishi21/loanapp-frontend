import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';
import { AddApplicationSecurityComponent } from './add/add-application-security.component';
import { EditApplicationSecurityComponent } from './edit/edit-application-security.component';
import { NotificationService } from '../../../shared/notification.service';
import { LoanApplicationService } from '../../data/loan-application.service';
import { CollateralService } from '../../../collateral/data/collateral.service';
import { CollateralDataSource } from '../../../collateral/data/collateral-data.source';
import { CollateralModel } from '../../../collateral/models/collateral-model';

@Component({
    selector: 'app-application-guarantor',
    templateUrl: './application-security.component.html',
    styleUrls: ['./application-security.component.css']
})
export class ApplicationSecurityComponent implements OnInit, AfterViewInit {
    collateralColumns = [
        'title',
        'valuation_date',
        'valuation_amount',
        'location',
        'condition',
        'actions'
    ];

    loader = false;

    dialogRef: MatDialogRef<ConfirmationDialogComponent>;

    // Search field
    @ViewChild('search', {static: true}) search: ElementRef;
    // pagination
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    // Pagination
    length: number;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    meta: any;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    // Data for the list table display
    collateralDataSource: CollateralDataSource;

    loanApplicationData: any;

    loanId = '';
    memberId = '';

    constructor(private notification: NotificationService, private collateralService: CollateralService,
                private dialog: MatDialog, private loanApplicationService: LoanApplicationService) {
    }

    /**
     * Initialize data source
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {
        this.loanApplicationService.selectedLoanApplicationChanges$.subscribe(data => {

            if (data) {
                this.loanApplicationData = data;
                this.memberId = data.member_id;
            }
        });

        this.collateralDataSource = new CollateralDataSource(this.collateralService);
        // Load pagination data
        this.collateralDataSource.meta$.subscribe((res) => this.meta = res);
        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.collateralDataSource.load('', 0, 0, 'valuation_date', 'desc', 'member_id', this.memberId);
    }

    /**
     * Add dialog launch
     */
    addDialog(id) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {id};

        const dialogRef = this.dialog.open(AddApplicationSecurityComponent, dialogConfig);
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
    editDialog(collateral: CollateralModel) {

        const id = collateral.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {collateral};

        const dialogRef = this.dialog.open(EditApplicationSecurityComponent, dialogConfig);
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
        this.collateralDataSource.load(
            this.search.nativeElement.value,
            (this.paginator.pageIndex + 1),
            (this.paginator.pageSize),
            this.sort.active,
            this.sort.direction,
            'member_id', this.memberId
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
     * Open Edit form
     * @param collateral
     */
    openConfirmationDialog(collateral: CollateralModel) {

        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });
        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.delete(collateral);
            }
            this.dialogRef = null;
        });
    }

    /**
     * Remove resource from db
     * @param collateral
     */
    delete(collateral: CollateralModel) {
        this.loader = true;
        this.collateralService.delete(collateral)
            .subscribe((data) => {
                    this.loader = false;
                    this.loadData();
                    this.notification.showNotification('success', 'Success !! Collateral has been deleted.');
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
