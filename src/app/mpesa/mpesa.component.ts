import { Component, OnInit } from '@angular/core';
import { MpesaSummaryService } from './data/mpesa-summary.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-mpesa',
    templateUrl: './mpesa.component.html',
    styleUrls: ['./mpesa.component.css']
})
export class MpesaComponent implements OnInit {

    mpesaBalance: any;
    balanceLoaded = false;

    data: any;

    totalDisbursement: any;
    transactionCount: any;
    customerCount: any;

    constructor(private mpesaSummaryService: MpesaSummaryService, private route: ActivatedRoute) {
        if (this.route.snapshot.data['summary']) {
            this.data = this.route.snapshot.data['summary'];
        }
    }

    /**
     * Initialize data lead
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {
        if (this.data !== null) {
            this.totalDisbursement = this.data.total_disbursement;
            this.transactionCount = this.data.transaction_count;
            this.customerCount = this.data.customer_count;
        }


        this.mpesaSummaryService.getMpesaBalance()
            .subscribe((res) => {
                    this.balanceLoaded = true;
                    this.mpesaBalance = res;
            },
                () => {
                    this.balanceLoaded = true;
                }
            );
    }
}


