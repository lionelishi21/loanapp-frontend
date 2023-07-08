import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatStepper } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BorrowerModel } from '../models/borrower-model';
import { BorrowerService } from '../data/borrower.service';

import { NotificationService } from '../../shared/notification.service';
import { PaymentMethodSettingService } from '../../settings/payment/method/data/payment-method-setting.service';

@Component({
    selector: 'app-add-borrower',
    styles: [],
    templateUrl: './add-borrower.component.html'
})
export class AddBorrowerComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    member: BorrowerModel;

    loader = false;

    memberMethods: any = [];

    formGroup: FormGroup;

    witness_types: any = [];
    members: any = [];
    borrower_statuses: any = [];

    @ViewChild('stepper', {static: true }) stepper: MatStepper;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private memberService: BorrowerService,
                private notification: NotificationService,
                private memberMethodService: PaymentMethodSettingService,
                private dialogRef: MatDialogRef<AddBorrowerComponent>) {

        this.witness_types = row.witness_types;
        this.members = row.members;
        this.borrower_statuses = row.borrower_statuses;
    }

    ngOnInit() {

        this.memberMethodService.list('name')
            .subscribe((res) => this.memberMethods = res,
                () => this.memberMethods = []
            );

        this.form = this.fb.group({
            member_id: [''],
            credit_score: [''],
            borrower_status_id: [''],
            witness_type_id: [''],
            witness_first_name: [''],
            witness_last_name: [''],
            witness_country: [''],
            witness_city: [''],
            witness_national_id: [''],
            witness_phone: [''],
            witness_email: [''],
            witness_postal_address: [''],
            witness_residential_address: [''],
            notes: [''],
        });
    }

    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }

    /**
     * Create member
     */
    create() {

        const body = Object.assign({}, this.member, this.form.value);

        this.loader = true;

        this.memberService.create(body)
            .subscribe((data) => {
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! New borrower created.');
                },
                (error) => {
                    this.loader = false;
                    if (error.member === 0) {
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

