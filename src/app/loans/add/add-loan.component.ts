import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatStepper } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanModel } from '../models/loan-model';
import { LoanService } from '../data/loan.service';

import { NotificationService } from '../../shared/notification.service';

@Component({
    selector: 'app-add-loan',
    styles: [],
    templateUrl: './add-loan.component.html'
})
export class AddLoanComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    lead: LoanModel;

    loader = false;

    isLinear = true;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;

    formGroup: FormGroup;

    leadStatuses: any = [];
    leadSources: any = [];
    leadTypes: any = [];

    @ViewChild('stepper', {static: true }) stepper: MatStepper;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private leadService: LoanService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<AddLoanComponent>) {
    }

    ngOnInit() {
        this.firstFormGroup = this.fb.group({
            title: ['', Validators.required],
            amount: [''],
            organization: [''],
            first_name: [''],
            last_name: [''],
            email: [''],
        });

        this.secondFormGroup = this.fb.group({
            phone: ['', Validators.required],
            mobile: [''],
            address1: [''],
            address2: [''],
            preferred_comm: [''],
            industry: [''],
            country: [''],
            state: [''],
            city: [''],
        });

        this.thirdFormGroup = this.fb.group({
            status_id: ['', Validators.required],
            source_id: [''],
            type_id: [''],
            company_id: [''],
            lead_owner_id: [''],
            zip_code: [''],
            website: [''],
            notes: [''],
        });
    }

    close() {
        this.dialogRef.close();
    }

    /**
     * Create lead
     */
    create() {

        const data = {...this.firstFormGroup.value, ...this.secondFormGroup.value, ...this.thirdFormGroup.value};

        const body = Object.assign({}, this.lead, data);
        this.loader = true;

        this.leadService.create(body)
            .subscribe((res) => {
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! New lead created.');
                },
                (error) => {
                    this.loader = false;
                    if (error.lead === 0) {
                        this.notification.showNotification('danger', 'Connection Error !! Nothing created.' +
                            ' Check your connection and retry.');
                        return;
                    }
                    // An array of all form errors as returned by server
                    this.formErrors = error;

                    if (this.formErrors) {
                        // loop through from fields, If has an error, mark as invalid so mat-error can show
                        for (const prop in this.formErrors) {
                            this.stepper.selectedIndex = 0;

                            if (this.thirdFormGroup.controls[prop]) {
                                this.thirdFormGroup.controls[prop].setErrors({incorrect: true});
                            }
                            if (this.secondFormGroup.controls[prop]) {
                            this.secondFormGroup.controls[prop].setErrors({incorrect: true});
                            }
                            if (this.firstFormGroup.controls[prop]) {
                                this.firstFormGroup.controls[prop].setErrors({incorrect: true});
                            }
                        }
                    }

                });
    }

    /**
     *
     */
    public onSaveComplete(): void {
        this.loader = false;
        this.dialogRef.close();
    }

}

