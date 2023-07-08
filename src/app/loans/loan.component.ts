import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../shared/delete/confirmation-dialog-component';
import { LoanService } from './data/loan.service';
import { AddLoanComponent } from './add/add-loan.component';
import { LoanModel } from './models/loan-model';
import { EditLoanComponent } from './edit/edit-loan.component';
import { LoanDataSource } from './data/loan-data.source';
import { NotificationService } from '../shared/notification.service';
import { LoanAmortizationComponent } from './amortization/loan-amortization.component';
import { StatementComponent } from '../accounting/statement/statement.component';
import { AccountingService } from '../accounting/data/accounting.service';

@Component({
    selector: 'app-loans',
    templateUrl: './loan.component.html',
    styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'loan_officer',
        'loan_reference_number',
        'member_id',
        'loan_type_id',
        'amount_approved',
        'balance',
        'next_repayment_date',
        'amortization',
        'actions',
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
    dataSource: LoanDataSource;
    selectedRowIndex = '';

    constructor(private service: LoanService, private notification: NotificationService,
                private dialog: MatDialog, private accountingService: AccountingService) {
    }

    /**
     * Initialize data lead
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.dataSource = new LoanDataSource(this.service);

        // Load pagination data
        this.dataSource.meta$.subscribe((res) => this.meta = res);

        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.dataSource.load('', 0, 0, 'loan_reference_number', 'desc', 'closed_on');
    }

    /**
     * Add dialog launch
     */
    addDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        const dialogRef = this.dialog.open(AddLoanComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    this.loadData();
                }
            }
        );
    }

    onSelected(loan: LoanModel): void {
        this.selectedRowIndex = loan.id;
        this.service.changeSelectedLoan(loan);
    }

    /**
     * Edit dialog launch
     */
    amortizationDialog(loan: LoanModel) {

        const id = loan.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {loan};

        const dialogRef = this.dialog.open(LoanAmortizationComponent, dialogConfig);
    }


    /**
     * Edit dialog launch
     */
    editDialog(lead: LoanModel) {

        const id = lead.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {lead};

        const dialogRef = this.dialog.open(EditLoanComponent, dialogConfig);
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
            this.sort.direction,
            'closed_on'
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
     * @param lead
     */
    openConfirmationDialog(lead: LoanModel) {

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


    accountBalance(row) {
        const id = row.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {
            id: id,
            type: 'loan'
        };

        const dialogRef = this.dialog.open(StatementComponent, dialogConfig);
    }

    /**
     * Remove resource from db
     * @param lead
     */
    delete(lead: LoanModel) {
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

    /**
     *
     * @param row
     */
    downloadAmortization(row: any) {
        this.loader = true;
        this.service.downloadAmortizationStatement({id: row.id, pdf: true})
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
     * @param row
     */
    downloadStatement(row: any) {

        this.loader = true;
        this.accountingService.downloadLoanAccountStatement({id: row.id, pdf: true})
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
}


