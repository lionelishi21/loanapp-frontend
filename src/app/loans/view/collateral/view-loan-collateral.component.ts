import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TransactionDataSource } from '../../../transactions/data/transaction-data.source';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { PaymentModel } from '../../../payments/models/payment-model';
import { ApplicationGuarantorService } from '../../../members/view/payment/data/application-guarantor.service';
import { NotificationService } from '../../../shared/notification.service';
import { LoanService } from '../../data/loan.service';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { CollateralService } from '../../../collateral/data/collateral.service';
import { CollateralDataSource } from '../../../collateral/data/collateral-data.source';

@Component({
    selector: 'app-view-loan-collateral',
    templateUrl: './view-loan-collateral.component.html',
    styleUrls: ['./view-loan-collateral.component.css']
})
export class ViewLoanCollateralComponent implements OnInit, AfterViewInit {

    collateralColumns = [
        'title',
        'valuation_date',
        'valuation_amount',
        'location',
        'condition',
        'actions'
    ];

    // Data for the list table display
    collateralDataSource: TransactionDataSource;
    // pagination
    @ViewChild(MatPaginator, {static: true }) paginator: MatPaginator;

    // Pagination
    length: number;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    meta: any;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    // Search field
    @ViewChild('search', {static: true}) search: ElementRef;

    payment: PaymentModel;
    loader = false;

    loanData: any;
    loanId = '';
    memberId = '';

    constructor(private service: ApplicationGuarantorService, private notification: NotificationService,
                private collateralService: CollateralService,
                private dialog: MatDialog, private loanService: LoanService) {}

    ngOnInit() {
        this.loanService.selectedLoanChanges$.subscribe(data => {
            if (data) {
                this.loanData = data;
                this.loanId = data.id;
                this.memberId = data.member_id;
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
     * Empty search box
     */
    clearSearch() {
        this.search.nativeElement.value = '';
        this.loadData()
    }

}
