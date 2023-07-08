import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentFrequencySettingModel } from '../model/payment-frequency-setting.model';
import { PaymentFrequencySettingService } from '../data/payment-frequency-setting.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-edit-payment-frequency',
    styles: [],
    templateUrl: './edit-payment-frequency.component.html'
})
export class EditPaymentFrequencyComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    interestType: PaymentFrequencySettingModel;

    loader = false;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private interestTypeService: PaymentFrequencySettingService,
                private notification: NotificationService,
    private dialogRef: MatDialogRef<EditPaymentFrequencyComponent>) {

        this.interestType = row.interestType;

        this.form = fb.group({
            name: [{value: this.interestType.name, disabled: true}, [Validators.required,
                Validators.minLength(3)]],
            display_name: [this.interestType.display_name],
            description: [this.interestType.description],
        });
    }

    ngOnInit() {
        //
    }

    close() {
        this.dialogRef.close();
    }

    updateSource() {
        const body = Object.assign({}, this.interestType, this.form.value);

        this.loader = true;
        this.interestTypeService.update(body)
            .subscribe((data) => {
                    this.loader = false;

                    this.dialogRef.close(this.form.value);

                    // notify success
                    this.notification.showNotification('success', 'Success !! Payment Frequency has been updated.');

                },
                (error) => {
                    this.loader = false;

                    if (error.interestType === 0) {
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
