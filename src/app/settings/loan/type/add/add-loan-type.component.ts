import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanTypeSettingModel } from '../model/loan-type-setting.model';
import { LoanTypeSettingService } from '../data/loan-type-setting.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-add-tax-type',
    styles: [],
    templateUrl: './add-loan-type.component.html'
})
export class AddLoanTypeComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    type: LoanTypeSettingModel;

    loader = false;

    interestTypes: any;
    paymentFrequencies: any;

    penaltyTypes: any = [];
    penaltyFrequencies: any = [];

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private typeService: LoanTypeSettingService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<AddLoanTypeComponent>) {
        this.interestTypes = row.interestTypes;
        this.paymentFrequencies = row.paymentFrequencies;
        this.penaltyTypes = row.penaltyTypes;
        this.penaltyFrequencies = row.penaltyFrequencies;
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: ['', [Validators.required,
                Validators.minLength(3)]],
            repayment_period: [''],
            interest_rate: [''],
            interest_type_id: [''],
            service_fee: [0],
            payment_frequency_id: [''],
            description: [''],
            active_status: [''],
            penalty_type_id: [''],
            penalty_value: [0],
            penalty_frequency_id: ['']
        });
    }

    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }

    /**
     * Create a resource
     */
    createType() {

        const body = Object.assign({}, this.type, this.form.value);

        this.loader = true;

        this.typeService.create(body)
            .subscribe((data) => {
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! New Loan Type created.');
                },
                (error) => {
                    this.loader = false;
                    if (error.type === 0) {
                        this.notification.showNotification('danger', 'Connection Error !! Nothing created.' +
                            ' Check your connection and retry.');
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

    /**
     *
     */
    public onSaveComplete(): void {
        this.loader = false;
        this.form.reset();
        this.dialogRef.close(this.form.value);
    }

}
