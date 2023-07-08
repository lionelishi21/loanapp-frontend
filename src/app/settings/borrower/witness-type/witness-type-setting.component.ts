import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';
import { WitnessTypeSettingDataSource } from './data/witness-type-setting-data.source';
import { WitnessTypeSettingService } from './data/witness-type-setting.service';
import { AddWitnessTypeComponent } from './add/add-witness-type.component';
import { WitnessTypeSettingModel } from './model/witness-type-setting.model';
import { EditWitnessTypeComponent } from './edit/edit-witness-type.component';
import { NotificationService } from '../../../shared/notification.service';

@Component({
    selector: 'app-witness-type-setting',
    templateUrl: './witness-type-setting.component.html',
    styleUrls: ['./witness-type-setting.component.css']
})
export class WitnessTypeSettingComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'name',
        'display_name',
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
    dataSource: WitnessTypeSettingDataSource;

    constructor(private service: WitnessTypeSettingService, private notification: NotificationService, private dialog: MatDialog) {
    }

    /**
     * Initialize data source
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.dataSource = new WitnessTypeSettingDataSource(this.service);

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

        const dialogRef = this.dialog.open(AddWitnessTypeComponent, dialogConfig);
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
    editDialog(type: WitnessTypeSettingModel) {

        const id = type.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {type};

        const dialogRef = this.dialog.open(EditWitnessTypeComponent, dialogConfig);
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
            // startWith(null),
            tap(() => this.loadData() ),
            tap( () => console.log('Page Index: ' + (this.paginator.pageIndex + 1))),
            tap( () => console.log('Page Size: ' + (this.paginator.pageSize)))
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
    openConfirmationDialog(type: WitnessTypeSettingModel) {

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
    delete(type: WitnessTypeSettingModel) {
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
