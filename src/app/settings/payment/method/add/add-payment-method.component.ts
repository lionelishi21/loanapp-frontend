import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentMethodSettingModel } from '../model/payment-method-setting.model';
import { PaymentMethodSettingService } from '../data/payment-method-setting.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-add-payment-method',
    styles: [],
    templateUrl: './add-payment-method.component.html'
})
export class AddPaymentMethodComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    method: PaymentMethodSettingModel;

    loader = false;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private methodService: PaymentMethodSettingService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<AddPaymentMethodComponent>) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: ['', [Validators.required,
                Validators.minLength(3)]],
            display_name: ['', [Validators.required,
                Validators.minLength(3)]],
            description: [''],
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
    createMethod() {

        const body = Object.assign({}, this.method, this.form.value);

        this.loader = true;

        this.methodService.create(body)
            .subscribe((data) => {
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! New Payment Method created.');
                },
                (error) => {
                    this.loader = false;
                    if (error.message) {
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
