import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';
import { CapitalSettingDataSource } from './data/capital-setting-data.source';
import { CapitalSettingService } from './data/capital-setting.service';
import { AddCapitalComponent } from './add/add-capital.component';
import { CapitalSettingModel } from './model/capital-setting.model';
import { EditCapitalComponent } from './edit/edit-capital.component';
import { NotificationService } from '../../../shared/notification.service';
import { PeriodSettingService } from '../period/data/period-setting.service';
import { BranchService } from '../../branch/general/data/branch.service';
import { PaymentMethodSettingService } from '../../payment/method/data/payment-method-setting.service';

@Component({
    selector: 'app-capital-setting',
    templateUrl: './capital-setting.component.html',
    styleUrls: ['./capital-setting.component.css']
})
export class CapitalSettingComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'capital_date',
        'method_id',
        'branch_id',
        'amount',
        'description'
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
    dataSource: CapitalSettingDataSource;

    interestTypes: any = [];
    branches: any = [];
    paymentMethods: any = [];


    constructor(private service: CapitalSettingService, private interestTypeService: PeriodSettingService,
                private notification: NotificationService, private dialog: MatDialog,
                private branchService: BranchService, private paymentMethodService: PaymentMethodSettingService) {
    }

    /**
     * Initialize data source
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.dataSource = new CapitalSettingDataSource(this.service);

        // Load pagination data
        this.dataSource.meta$.subscribe((res) => this.meta = res);

        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.dataSource.load('', 0, 0, 'capital_date', 'asc');

        this.branchService.list('name')
            .subscribe((res) => this.branches = res,
                () => this.branches = []
            );

        this.paymentMethodService.list('name')
            .subscribe((res) => this.paymentMethods = res,
                () => this.paymentMethods = []
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
            branches: this.branches,
            paymentMethods: this.paymentMethods
        };

        const dialogRef = this.dialog.open(AddCapitalComponent, dialogConfig);
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
    editDialog(type: CapitalSettingModel) {

        const id = type.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            branches: this.branches,
            paymentMethods: this.paymentMethods
        };

        const dialogRef = this.dialog.open(EditCapitalComponent, dialogConfig);
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
    openConfirmationDialog(type: CapitalSettingModel) {

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
    delete(type: CapitalSettingModel) {
        this.loader = true;
        this.service.delete(type)
            .subscribe((data) => {
                    this.loader = false;
                    this.loadData();
                    this.notification.showNotification('success', 'Success !! Capital has been deleted.');
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
