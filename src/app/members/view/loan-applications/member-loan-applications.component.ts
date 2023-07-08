import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from '../../../shared/notification.service';
import { MemberService } from '../../data/member.service';
import { PaymentModel } from '../../../payments/models/payment-model';
import { LoanApplicationDataSource } from '../../../loan-applications/data/loan-application-data.source';
import { LoanApplicationService } from '../../../loan-applications/data/loan-application.service';

@Component({
    selector: 'app-member-applications',
    templateUrl: './member-loan-applications.component.html',
    styleUrls: ['./member-loan-applications.component.css']
})
export class MemberLoanApplicationsComponent implements OnInit, AfterViewInit {

    loanApplicationColumns = [
        'application_date',
        'amount_applied',
        'loan_type_id',
        'repayment_period',
        'payment_frequency_id',
        'approved_on',
        'reviewed_on',
    ];

    // Data for the list table display
    loanApplicationDataSource: LoanApplicationDataSource;
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

    constructor(private notification: NotificationService, private loanApplicationService: LoanApplicationService,
                private dialog: MatDialog, private memberService: MemberService) {}

    ngOnInit() {

        this.memberService.selectedMemberChanges$.subscribe(data => {
            if (data) {
                this.memberData = data;
                this.memberId = data.id;
            }
        });

        this.loanApplicationDataSource = new LoanApplicationDataSource(this.loanApplicationService);
        // Load pagination data
        this.loanApplicationDataSource.meta$.subscribe((res) => this.meta = res);
        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.loanApplicationDataSource.load('', 0, 0, 'application_date', 'desc', 'member_id', this.memberId);
    }

    /**
     * Fetch data from data lead
     */
    loadData() {
        this.loanApplicationDataSource.load(
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
