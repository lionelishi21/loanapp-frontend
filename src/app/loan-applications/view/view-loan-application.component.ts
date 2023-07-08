import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoanApplicationModel } from '../models/loan-application-model';
import { LoanApplicationService } from '../data/loan-application.service';
import { NotificationService } from '../../shared/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-view-loan-application',
    styles: [],
    templateUrl: './view-loan-application.component.html'
})
export class ViewLoanApplicationComponent implements OnInit  {

    permissions = ['loan-application-review'];

    form: FormGroup;
    generalForm: FormGroup;
    guarantorForm: FormGroup;
    assetForm: FormGroup;

    formErrors: any;

    loanApplication: LoanApplicationModel;

    loader = false;

    members: any = [];

    id: string;

    routeData: any;

    loanApplicationData: any;
    loanApplicationId = '';
    loanApplicationData$: any;

    constructor(private activeRoute: ActivatedRoute,
                private fb: FormBuilder,
                private loanApplicationService: LoanApplicationService,
                private notification: NotificationService,
                private router: Router, private route: ActivatedRoute
                ) {
        this.routeData = this.router.getCurrentNavigation().extras.state;

    }

    ngOnInit() {

        this.id = this.route.snapshot.paramMap.get('id');

        this.loanApplicationService.selectedLoanApplicationChanges$.subscribe(data => {
            // Data from service
            this.loanApplicationData = data;
           });

        if (this.loanApplicationData == null) {
            // Data isn't in service, so we fetch from the route resolver
            if (this.route.snapshot.data['loanApp']) {
                this.loanApplicationData = this.route.snapshot.data['loanApp'].data;
                this.loanApplicationService.changeSelectedLoanApplication(this.loanApplicationData);
            }
        }


        this.form = this.fb.group({
            member_id: [''],
            approved_by_user_id: [''],
            application_date: [''],
            amount_applied: [''],
            repayment_period: [''],
            status_id: [''],
        });

        this.generalForm = this.fb.group({
            member_id: [''],
            loan_application_id: [''],
            assign_date: [''],
            guarantee_amount: [''],
            status_id: ['']
        });

        this.guarantorForm = this.fb.group({
            member_id: [''],
            loan_application_id: [''],
            assign_date: [''],
            guarantee_amount: [''],
            status_id: ['']
        });

        this.assetForm = this.fb.group({
            member_id: [''],
            loan_application_id: [''],
            assign_date: [''],
            guarantee_amount: ['']
        });
    }

    close() {
    }

    update() {
        const body = Object.assign({}, this.loanApplication, this.form.value);

        this.loader = true;
        this.loanApplicationService.update(body)
            .subscribe((data) => {
                    this.loader = false;
                    // notify success
                    this.notification.showNotification('success', 'Success !! Loan application has been updated.');

                },
                (error) => {
                    this.loader = false;
                    if (error.member === 0) {
                        // notify error
                        return;
                    }
                    // An array of all form errors as returned by server
                    this.formErrors = error;

                    if (this.formErrors) {
                        // loop through from fields, If has an error, mark as invalid so mat-error can show
                        for (const prop in this.formErrors) {
                            if (this.form) {
                                this.form.controls[prop].setErrors({incorrect: true});
                            }
                        }
                    }
                });
    }

}
