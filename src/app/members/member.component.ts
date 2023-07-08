import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../shared/delete/confirmation-dialog-component';
import { MemberService } from './data/member.service';
import { AddMemberComponent } from './add/add-member.component';
import { MemberModel } from './models/member-model';
import { EditMemberComponent } from './edit/edit-member.component';
import { MemberDataSource } from './data/member-data.source';
import { NotificationService } from '../shared/notification.service';
import { BranchService } from '../settings/branch/general/data/branch.service';
import { StatementComponent } from '../accounting/statement/statement.component';
import { AccountingService } from '../accounting/data/accounting.service';

@Component({
    selector: 'app-members',
    templateUrl: './member.component.html',
    styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'created_at',
        'branch',
        'first_name',
        'id_number',
        'phone',
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
    dataSource: MemberDataSource;
    selectedRowIndex = '';

    branches: any = [];

    constructor(private service: MemberService, private branchService: BranchService, private accountingService: AccountingService,
                private notification: NotificationService, private dialog: MatDialog) {
    }

    /**
     * Initialize data lead
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.dataSource = new MemberDataSource(this.service);

        // Load pagination data
        this.dataSource.meta$.subscribe((res) => this.meta = res);

        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.dataSource.load('', 0, 0, 'created_at', 'desc');

       this.branchService.list('name')
            .subscribe((res) => this.branches = res,
                () => this.branches = []
            );

    }

    onSelected(member: MemberModel): void {
        this.selectedRowIndex = member.id;
        this.service.changeSelectedMember(member);
    }

    /**
     * Add dialog launch
     */
    addDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {
            branches: this.branches
        };

        const dialogRef = this.dialog.open(AddMemberComponent, dialogConfig);
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
    editDialog(member: MemberModel) {

        const id = member.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {member,
            branches: this.branches
        };

        const dialogRef = this.dialog.open(EditMemberComponent, dialogConfig);
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
     *
     * @param row
     */
    downloadStatement(row: any) {

        this.loader = true;
        this.accountingService.downloadMemberAccountStatement({id: row.id, pdf: true})
            .subscribe((res) => {
                    this.loader = false;
                    this.showFile(res);
                },
                () => {
                    this.loader = false;
                    this.notification.showNotification('danger', 'Error Downloading File!');
                }
            );
    }


    /**
     *
     * @param blob
     */
    showFile(blob){
        let newBlob = new Blob([blob], {type: "application/pdf"});

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }
        const data = window.URL.createObjectURL(newBlob);
        let link = document.createElement('a');
        link.href = data;
        link.download="statement.pdf";
        link.click();
        setTimeout(function(){
            window.URL.revokeObjectURL(data);
        }, 100);
    }


    /**
     *
     * @param row
     */
    getAccountBalance(row) {
        const id = row.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {
            id: id,
            type: 'member'
        };

        const dialogRef = this.dialog.open(StatementComponent, dialogConfig);
    }

    /**
     * Open Edit form
     * @param lead
     */
    openConfirmationDialog(lead: MemberModel) {

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
    delete(lead: MemberModel) {
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


