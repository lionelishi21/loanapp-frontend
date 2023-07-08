import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';

import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BranchDataSource } from './data/branch-data.source';
import { BranchService } from './data/branch.service';
import { AddBranchComponent } from './add/add-branch.component';
import { BranchModel } from './model/branch.model';
import { EditBranchComponent } from './edit/edit-branch.component';
import { NotificationService } from '../../../shared/notification.service';

@Component({
    selector: 'app-branch-general-setting',
    templateUrl: './branch-general-setting.component.html',
    styleUrls: ['./branch-general-setting.component.css']
})
export class BranchGeneralSettingComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'name',
        'branch_code',
        'location',
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
    dataSource: BranchDataSource;

    constructor(private service: BranchService, private notification: NotificationService, private dialog: MatDialog) {
    }

    /**
     * Initialize data source
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.dataSource = new BranchDataSource(this.service);

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

        const dialogRef = this.dialog.open(AddBranchComponent, dialogConfig);
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
    editDialog(branch: BranchModel) {

        const id = branch.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {branch};

        const dialogRef = this.dialog.open(EditBranchComponent, dialogConfig);
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
     * @param branch
     */
    openConfirmationDialog(branch: BranchModel) {

        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });

        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.delete(branch);
            }
            this.dialogRef = null;
        });
    }

    /**
     * Remove resource from db
     * @param branch
     */
    delete(branch: BranchModel) {
        this.loader = true;
        this.service.delete(branch)
            .subscribe((data) => {
                    this.loader = false;
                    this.loadData();
                    this.notification.showNotification('success', 'Success !! Branch has been deleted.');
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
