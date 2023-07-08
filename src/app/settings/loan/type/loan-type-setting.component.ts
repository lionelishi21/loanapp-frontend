import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';
import { LoanTypeSettingDataSource } from './data/loan-type-setting-data.source';
import { LoanTypeSettingService } from './data/loan-type-setting.service';
import { AddLoanTypeComponent } from './add/add-loan-type.component';
import { LoanTypeSettingModel } from './model/loan-type-setting.model';
import { EditLoanTypeComponent } from './edit/edit-loan-type.component';
import { NotificationService } from '../../../shared/notification.service';
import { InterestTypeSettingService } from '../interest-type/data/interest-type-setting.service';
import { PaymentFrequencySettingService } from '../payment-frequency/data/payment-frequency-setting.service';
import { FormBuilder } from '@angular/forms';
import { PenaltyTypeSettingService } from '../penalty/data/penalty-type-setting.service';
import { PenaltyFrequencySettingService } from '../penalty/data/penalty-frequency-setting.service';

@Component({
    selector: 'app-loan-type-setting',
    templateUrl: './loan-type-setting.component.html',
    styleUrls: ['./loan-type-setting.component.css']
})
export class LoanTypeSettingComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'name',
        'interest_rate',
        'interest_type_id',
        'repayment_period',
        'payment_frequency_id',
        'actions',
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
    dataSource: LoanTypeSettingDataSource;

    interestTypes: any = [];
    paymentFrequencies: any = [];

    penaltyTypes: any = [];
    penaltyFrequencies: any = [];

    constructor(private service: LoanTypeSettingService, private interestTypeService: InterestTypeSettingService,
                private notification: NotificationService, private dialog: MatDialog,
                private paymentFrequencyService: PaymentFrequencySettingService, private penaltyTypeService: PenaltyTypeSettingService,
                private penaltyFrequencyService: PenaltyFrequencySettingService) {
    }

    /**
     * Initialize data source
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.dataSource = new LoanTypeSettingDataSource(this.service);

        // Load pagination data
        this.dataSource.meta$.subscribe((res) => this.meta = res);

        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.dataSource.load('', 0, 0, 'name', 'asc');

        this.interestTypeService.list(['name', 'display_name'])
            .subscribe((res) => this.interestTypes = res,
                () => this.interestTypes = []
            );

        this.paymentFrequencyService.list(['name', 'display_name'])
            .subscribe((res) => this.paymentFrequencies = res,
                () => this.paymentFrequencies = []
            );

        this.penaltyTypeService.list(['name', 'display_name'])
            .subscribe((res) => this.penaltyTypes = res,
                () => this.penaltyTypes = []
            );

        this.penaltyFrequencyService.list(['name', 'display_name'])
            .subscribe((res) => this.penaltyFrequencies = res,
                () => this.penaltyFrequencies = []
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
            interestTypes: this.interestTypes,
            paymentFrequencies: this.paymentFrequencies,
            penaltyTypes: this.penaltyTypes,
            penaltyFrequencies: this.penaltyFrequencies
        };

        const dialogRef = this.dialog.open(AddLoanTypeComponent, dialogConfig);
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
    editDialog(type: LoanTypeSettingModel) {

        const id = type.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {type,
            interestTypes: this.interestTypes,
            paymentFrequencies: this.paymentFrequencies,
            penaltyTypes: this.penaltyTypes,
            penaltyFrequencies: this.penaltyFrequencies
        };

        const dialogRef = this.dialog.open(EditLoanTypeComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    this.loadData();
                }
            }
        );
    }

    /**
     * Fetch data from data source
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
     * @param type
     */
    openConfirmationDialog(type: LoanTypeSettingModel) {

        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });

        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.delete(type);
            }
            this.dialogRef = null;
        });
    }

    /**
     * Remove resource from db
     * @param type
     */
    delete(type: LoanTypeSettingModel) {
        this.loader = true;
        this.service.delete(type)
            .subscribe((data) => {
                    this.loader = false;
                    this.loadData();
                    this.notification.showNotification('success', 'Success !! Type has been deleted.');
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
