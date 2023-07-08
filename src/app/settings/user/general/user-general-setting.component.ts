import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';

import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import { AddUserComponent } from './add/add-user.component';
import { EditUserComponent } from './edit/edit-user.component';
import { UserSettingModel } from '../model/user-setting.model';
import { UserSettingDataSource } from '../data/user-setting-data.source';
import { UserSettingService } from '../data/user-setting.service';
import { NotificationService } from '../../../shared/notification.service';
import { RoleSettingService } from '../data/role-setting.service';
import { EmployeeService } from '../../employee/general/data/employee.service';
import { BranchService } from '../../branch/general/data/branch.service';

@Component({
    selector: 'app-user-general-setting',
    templateUrl: './user-general-setting.component.html',
    styleUrls: ['./user-general-setting.component.css']
})
export class UserGeneralSettingComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'branch_id',
        'role_id',
        'first_name',
        'last_name',
        'email',
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
    dataSource: UserSettingDataSource;

    roles: any = [];
    employees: any = [];
    branches: any = [];

    constructor(private service: UserSettingService, private notification: NotificationService,
                private roleService: RoleSettingService, private employeeService: EmployeeService,
                private dialog: MatDialog, private branchService: BranchService) {
    }

    /**
     * Initialize data source
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.dataSource = new UserSettingDataSource(this.service);

        // Load pagination data
        this.dataSource.meta$.subscribe((res) => this.meta = res);

        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.dataSource.load('', 0, 0, 'first_name', 'asc');

        this.roleService.list('name')
            .subscribe((res) => this.roles = res,
                () => this.roles = []
            );

        this.employeeService.list('first_name')
            .subscribe((res) => this.employees = res,
                () => this.employees = []
            );

        this.branchService.list('name')
            .subscribe((res) => this.branches = res,
                () => this.branches = []
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
            roles: this.roles,
            employees: this.employees,
            branches: this.branches
        };

        const dialogRef = this.dialog.open(AddUserComponent, dialogConfig);
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
    editDialog(user: UserSettingModel) {

        const id = user.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {user,
            roles: this.roles,
            employees: this.employees,
            branches: this.branches
        };

        const dialogRef = this.dialog.open(EditUserComponent, dialogConfig);
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
     * @param user
     */
    openConfirmationDialog(user: UserSettingModel) {

        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });

        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.delete(user);
            }
            this.dialogRef = null;
        });
    }

    /**
     * Remove resource from db
     * @param user
     */
    delete(user: UserSettingModel) {
        this.loader = true;
        this.service.delete(user)
            .subscribe((data) => {
                    this.loader = false;
                    this.loadData();
                    this.notification.showNotification('success', 'Success !! User has been deleted.');
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
