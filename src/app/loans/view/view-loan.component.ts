import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '../../shared/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanModel } from '../models/loan-model';
import { LoanService } from '../data/loan.service';

@Component({
    selector: 'app-view-loan',
    styles: [],
    templateUrl: './view-loan.component.html'
})
export class ViewLoanComponent implements OnInit  {

    form: FormGroup;
    generalForm: FormGroup;
    guarantorForm: FormGroup;
    assetForm: FormGroup;

    formErrors: any;

    loanApplication: LoanModel;

    loader = false;

    memberStatuses: any = [];
    members: any = [];
    guarantorStatues: any = [];

    id: string;

    routeData: any;

    loanData: any;
    loanId = '';
    loanData$: any;

    constructor(private fb: FormBuilder,
                private loanService: LoanService,
                private notification: NotificationService,
                private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {

        this.id = this.route.snapshot.paramMap.get('id');

        this.loanService.selectedLoanChanges$.subscribe(data => {
            // Data from service
            this.loanData = data;
        });

        if (this.loanData == null) {
            // Data isn't in service, so we fetch from the route resolver
            if (this.route.snapshot.data['loan']) {
                this.loanData = this.route.snapshot.data['loan'].data;
                this.loanService.changeSelectedLoan(this.loanData);
            }
        }
    }

    close() {
    }

}
