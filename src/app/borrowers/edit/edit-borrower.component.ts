import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BorrowerModel } from '../models/borrower-model';
import { BorrowerService } from '../data/borrower.service';
import { NotificationService } from '../../shared/notification.service';
import { PaymentMethodSettingService } from '../../settings/payment/method/data/payment-method-setting.service';

@Component({
    selector: 'app-edit-borrower',
    styles: [],
    templateUrl: './edit-borrower.component.html'
})
export class EditBorrowerComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    borrower: BorrowerModel;

    loader = false;

    witness_types: any = [];
    members: any = [];
    borrower_statuses: any = [];

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private memberService: BorrowerService,
                private memberStatusService: PaymentMethodSettingService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<EditBorrowerComponent>) {

        this.borrower = row.borrower;
        this.witness_types = row.witness_types;
        this.members = row.members;
        this.borrower_statuses = row.borrower_statuses;
    }

    ngOnInit() {

        this.form = this.fb.group({
            member_id: [this.borrower.member_id, [Validators.required,
                Validators.minLength(3)]],
            credit_score: [this.borrower.credit_score],
            borrower_status_id: [this.borrower.borrower_status_id],
            witness_type_id: [this.borrower.witness_type_id],
            witness_first_name: [this.borrower.witness_first_name],
            witness_last_name: [this.borrower.witness_last_name],
            witness_country: [this.borrower.witness_country],
            witness_city: [this.borrower.witness_city],
            witness_national_id: [this.borrower.witness_national_id],
            witness_phone: [this.borrower.witness_phone],
            witness_email: [this.borrower.witness_email],
            witness_postal_address: [this.borrower.witness_postal_address],
            witness_residential_address: [this.borrower.witness_residential_address],
            notes: [this.borrower.notes]
        });
    }

    close() {
        this.dialogRef.close();
    }

    update() {
        const body = Object.assign({}, this.borrower, this.form.value);

        this.loader = true;
        this.memberService.update(body)
            .subscribe((data) => {
                    this.loader = false;

                    this.dialogRef.close(this.form.value);

                    // notify success
                    this.notification.showNotification('success', 'Success !! Borrower has been updated.');

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
