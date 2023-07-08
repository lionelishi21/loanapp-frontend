import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatStepper } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanModel } from '../models/loan-model';
import { LoanService } from '../data/loan.service';
import { NotificationService } from '../../shared/notification.service';

@Component({
    selector: 'app-edit-loan',
    styles: [],
    templateUrl: './edit-loan.component.html'
})
export class EditLoanComponent implements OnInit  {

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
                private dialogRef: MatDialogRef<EditLoanComponent>) {

        this.lead = row.lead;

        this.form = fb.group({
            first_name: ['', [Validators.required,
                Validators.minLength(3)]],
            last_name: [''],
        });
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

    update() {
        const body = Object.assign({}, this.lead, this.form.value);

        this.loader = true;
        this.leadService.update(body)
            .subscribe((data) => {
                    this.loader = false;

                    this.dialogRef.close(this.form.value);

                    // notify success
                    this.notification.showNotification('success', 'Success !! Lead has been updated.');

                },
                (error) => {
                    this.loader = false;
                    if (error.lead === 0) {
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
