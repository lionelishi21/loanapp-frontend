import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from '../../../shared/notification.service';
import { MemberService } from '../../data/member.service';
import { TransactionDataSource } from '../../../transactions/data/transaction-data.source';
import { PaymentModel } from '../../../payments/models/payment-model';
import { GuarantorDataSource } from '../../../guarantors/data/guarantor-data.source';
import { GuarantorService } from '../../../guarantors/data/guarantor.service';

@Component({
    selector: 'app-member-guarantee',
    templateUrl: './member-guarantee.component.html',
    styleUrls: ['./member-guarantee.component.css']
})
export class MemberGuaranteeComponent implements OnInit, AfterViewInit {
    guarantorColumns = [
        'loan_application_id',
        'loan_type',
        'guarantee_amount',
        'member_id',
        'loan_status',
        'reviewed_on'
    ];

    // Data for the list table display
    guarantorDataSource: TransactionDataSource;
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

    constructor(private notification: NotificationService, private guarantorService: GuarantorService,
                private dialog: MatDialog, private memberService: MemberService) {}

    ngOnInit() {

        this.memberService.selectedMemberChanges$.subscribe(data => {
            if (data) {
                this.memberData = data;
                this.memberId = data.id;
            }
        });

        this.guarantorDataSource = new GuarantorDataSource(this.guarantorService);
        // Load pagination data
        this.guarantorDataSource.meta$.subscribe((res) => this.meta = res);
        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.guarantorDataSource.load('', 0, 0, 'created_at', 'desc', 'member_id', this.memberId);
    }

    /**
     * Fetch data from data lead
     */
    loadData() {
        this.guarantorDataSource.load(
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
