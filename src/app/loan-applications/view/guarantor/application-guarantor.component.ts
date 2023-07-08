import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';
import { ApplicationGuarantorDataSource } from './data/application-guarantor-data.source';
import { ApplicationGuarantorService } from './data/application-guarantor.service';
import { AddApplicationGuarantorComponent } from './add/add-application-guarantor.component';
import { ApplicationGuarantorModel } from './model/application-guarantor.model';
import { EditApplicationGuarantorComponent } from './edit/edit-application-guarantor.component';
import { NotificationService } from '../../../shared/notification.service';
import { LoanApplicationService } from '../../data/loan-application.service';
import { MemberService } from '../../../members/data/member.service';

@Component({
    selector: 'app-application-guarantor',
    templateUrl: './application-guarantor.component.html',
    styleUrls: ['./application-guarantor.component.css']
})
export class ApplicationGuarantorComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'member_id',
        'created_by',
        'created_at',
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
    dataSource: ApplicationGuarantorDataSource;

    @Input() memberId: string;

    members: any = [];
    guaranteeAmount: any = [];

    loanApplicationData: any;
    loanApplicationId = '';
    loanApplicationData$: any;

    constructor(private service: ApplicationGuarantorService, private notification: NotificationService,
                private dialog: MatDialog, private loanApplicationService: LoanApplicationService,
                private memberService: MemberService) {
    }

    /**
     * Initialize data source
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.loanApplicationData$ = this.loanApplicationService.selectedLoanApplicationChanges$;
        this.loanApplicationService.selectedLoanApplicationChanges$.subscribe(data => {
            if (data) {
                this.loanApplicationData = data;
                this.loanApplicationId = data.id;
            }
        });

        this.guaranteeAmount = this.loanApplicationData.amount_applied;

        this.dataSource = new ApplicationGuarantorDataSource(this.service);

        // Load pagination data
        this.dataSource.meta$.subscribe((res) => this.meta = res);

        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.dataSource.load('', 0, 0, 'created_at', 'asc', 'loan_application_id', this.loanApplicationId);

        this.memberService.list(['first_name', 'last_name', 'id_number'])
            .subscribe((res) => this.members = res,
                () => this.members = []
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
            members: this.members,
            guaranteeAmount: this.guaranteeAmount,
            applicationId: this.loanApplicationId,
        };

        const dialogRef = this.dialog.open(AddApplicationGuarantorComponent, dialogConfig);
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
    editDialog(guarantor: ApplicationGuarantorModel) {

        const id = guarantor.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {guarantor,
            members: this.members,
            guaranteeAmount: this.loanApplicationData.amount_applied,
            applicationId: this.loanApplicationId,
        };

        const dialogRef = this.dialog.open(EditApplicationGuarantorComponent, dialogConfig);
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
            this.sort.direction,
            'loan_application_id', this.loanApplicationId
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
     * @param method
     */
    openConfirmationDialog(method: ApplicationGuarantorModel) {

        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });

        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.delete(method);
            }
            this.dialogRef = null;
        });
    }

    /**
     * Remove resource from db
     * @param method
     */
    delete(method: ApplicationGuarantorModel) {
        this.loader = true;
        this.service.delete(method)
            .subscribe((data) => {
                    this.loader = false;
                    this.loadData();
                    this.notification.showNotification('success', 'Success !! Method has been deleted.');
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
