import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';
import { PeriodSettingService } from './data/period-setting.service';
import { AddPeriodComponent } from './add/add-period.component';
import { PeriodSettingModel } from './model/period-setting.model';
import { EditPeriodComponent } from './edit/edit-period.component';
import { NotificationService } from '../../../shared/notification.service';
import { PeriodSettingDataSource } from './data/period-setting-data.source';

@Component({
    selector: 'app-period-setting',
    templateUrl: './period-setting.component.html',
    styleUrls: ['./period-setting.component.css']
})
export class PeriodSettingComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'start_on',
        'end_on',
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
    dataSource: PeriodSettingDataSource;

    constructor(private service: PeriodSettingService, private notification: NotificationService, private dialog: MatDialog) {
    }

    /**
     * Initialize data interestType
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.dataSource = new PeriodSettingDataSource(this.service);

        // Load pagination data
        this.dataSource.meta$.subscribe((res) => this.meta = res);

        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.dataSource.load('', 0, 0, 'name', 'asc');

    }

    /**
     * Add dialog launch
     */
    addDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        const dialogRef = this.dialog.open(AddPeriodComponent, dialogConfig);
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
    editDialog(interestType: PeriodSettingModel) {

        const id = interestType.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {interestType};

        const dialogRef = this.dialog.open(EditPeriodComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    this.loadData();
                }
            }
        );
    }

    /**
     * Fetch data from data interestType
     */
    loadData() {
        console.log(this.sort.direction);
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
            tap(() => this.loadData() ),
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
     * @param interestType
     */
    openConfirmationDialog(interestType: PeriodSettingModel) {

        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });

        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.delete(interestType);
            }
            this.dialogRef = null;
        });
    }

    /**
     * Remove reinterestType from db
     * @param interestType
     */
    delete(interestType: PeriodSettingModel) {
        this.loader = true;
        this.service.delete(interestType)
            .subscribe((data) => {
                    this.loader = false;
                    this.loadData();
                    this.notification.showNotification('success', 'Success !! Source has been deleted.');
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
