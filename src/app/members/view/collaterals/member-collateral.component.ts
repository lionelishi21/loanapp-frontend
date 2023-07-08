import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from '../../../shared/notification.service';
import { TransactionDataSource } from '../../../transactions/data/transaction-data.source';
import { PaymentModel } from '../../../payments/models/payment-model';
import { CollateralService } from '../../../collateral/data/collateral.service';
import { CollateralDataSource } from '../../../collateral/data/collateral-data.source';
import { MemberService } from '../../data/member.service';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';
import { CollateralModel } from '../../../collateral/models/collateral-model';

@Component({
    selector: 'app-member-collateral',
    templateUrl: './member-collateral.component.html',
    styleUrls: ['./member-collateral.component.css']
})
export class MemberCollateralComponent implements OnInit, AfterViewInit {

    collateralColumns = [
        'asset_number',
        'title',
        'valuation_date',
        'valuation_amount',
        'location',
        'condition',
        'actions'
    ];

    dialogRef: MatDialogRef<ConfirmationDialogComponent>;

    // Data for the list table display
    collateralDataSource: TransactionDataSource;
    // pagination
    @ViewChild(MatPaginator, {static: true }) paginator: MatPaginator;
    // Search field
    @ViewChild('search', {static: true}) search: ElementRef;

    // Pagination
    length: number;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    meta: any;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    payment: PaymentModel;
    loader = false;

    memberData: any;
    memberId = '';

    constructor(private notification: NotificationService, private collateralService: CollateralService,
                private dialog: MatDialog, private memberService: MemberService) {}

    ngOnInit() {

        this.memberService.selectedMemberChanges$.subscribe(data => {
            if (data) {
                this.memberData = data;
                this.memberId = data.id;
            }
        });

        this.collateralDataSource = new CollateralDataSource(this.collateralService);
        // Load pagination data
        this.collateralDataSource.meta$.subscribe((res) => this.meta = res);
        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.collateralDataSource.load('', 0, 0, 'valuation_date', 'desc', 'member_id', this.memberId);
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

    editCollateral(row: any) {}

    /**
     * Open dialog to delete
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
