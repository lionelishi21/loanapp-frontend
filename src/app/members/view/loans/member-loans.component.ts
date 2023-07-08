import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from '../../../shared/notification.service';
import { MemberService } from '../../data/member.service';
import { LoanDataSource } from '../../../loans/data/loan-data.source';
import { LoanService } from '../../../loans/data/loan.service';
import { PaymentModel } from '../../../payments/models/payment-model';

@Component({
    selector: 'app-member-loans',
    templateUrl: './member-loans.component.html',
    styleUrls: ['./member-loans.component.css']
})
export class MemberLoansComponent implements OnInit, AfterViewInit {
    loanColumns = [
        'loan_reference_number',
        'loan_type_id',
        'repayment_period',
        'amount_approved',
        'balance',
        'next_repayment_date',
    ];

    // Data for the list table display
    loanDataSource: LoanDataSource;
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

    constructor(private notification: NotificationService, private loanService: LoanService,
                private dialog: MatDialog, private memberService: MemberService) {}

    ngOnInit() {

        this.memberService.selectedMemberChanges$.subscribe(data => {
            if (data) {
                this.memberData = data;
                this.memberId = data.id;
            }
        });

        this.loanDataSource = new LoanDataSource(this.loanService);
        // Load pagination data
        this.loanDataSource.meta$.subscribe((res) => this.meta = res);
        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.loanDataSource.load('', 0, 0, 'updated_at', 'desc', 'member_id', this.memberId);
    }

    /**
     * Fetch data from data lead
     */
    loadData() {
        this.loanDataSource.load(
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

    /**
     * Empty search box
     */
    clearSearch() {
        this.search.nativeElement.value = '';
        this.loadData()
    }

}
