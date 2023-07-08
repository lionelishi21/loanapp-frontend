import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GuarantorModel } from '../models/guarantor-model';
import { GuarantorService } from '../data/guarantor.service';
import { NotificationService } from '../../shared/notification.service';
import { PaymentMethodSettingService } from '../../settings/payment/method/data/payment-method-setting.service';

@Component({
    selector: 'app-edit-guarantor',
    styles: [],
    templateUrl: './edit-guarantor.component.html'
})
export class EditGuarantorComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    guarantor: GuarantorModel;

    loader = false;

    memberStatuses: any = [];

    members: any = [];
    loans: any = [];

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private memberService: GuarantorService,
                private memberStatusService: PaymentMethodSettingService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<EditGuarantorComponent>) {

        this.guarantor = row.guarantor;
        this.members = row.members;
        this.loans = row.loans;
    }

    ngOnInit() {
        this.form = this.fb.group({
            member_id: [this.guarantor.member_id, [Validators.required,
                Validators.minLength(3)]],
            loan_id: [this.guarantor.loan_id]
        });
    }

    close() {
        this.dialogRef.close();
    }

    update() {
        const body = Object.assign({}, this.guarantor, this.form.value);

        this.loader = true;
        this.memberService.update(body)
            .subscribe((data) => {
                    this.loader = false;

                    this.dialogRef.close(this.form.value);

                    // notify success
                    this.notification.showNotification('success', 'Success !! Guarantor has been updated.');

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
