import { Component, OnInit } from '@angular/core';
import { ApplicationGuarantorService } from '../../../members/view/payment/data/application-guarantor.service';
import { NotificationService } from '../../../shared/notification.service';
import { MatDialog } from '@angular/material';
import { LoanService } from '../../data/loan.service';

@Component({
    selector: 'app-view-loan-adjustment',
    templateUrl: './view-loan-adjustment.component.html',
    styleUrls: ['./view-loan-adjustment.component.css']
})
export class ViewLoanAdjustmentComponent implements OnInit {
    loanData: any;
    loanId = '';
    loanData$: any;

    constructor(private service: ApplicationGuarantorService, private notification: NotificationService,
                private dialog: MatDialog, private loanService: LoanService) {}

    ngOnInit() {

        this.loanData$ = this.loanService.selectedLoanChanges$;
        this.loanService.selectedLoanChanges$.subscribe(data => {

            if (data) {
                this.loanData = data;
                this.loanId = data.id;
            }
        });
    }

}
