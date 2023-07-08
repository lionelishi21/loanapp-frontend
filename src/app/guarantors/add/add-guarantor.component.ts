import { Component, ElementRef, Inject, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatStepper } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GuarantorModel } from '../models/guarantor-model';
import { GuarantorService } from '../data/guarantor.service';

import { NotificationService } from '../../shared/notification.service';
import { PaymentMethodSettingService } from '../../settings/payment/method/data/payment-method-setting.service';

@Component({
    selector: 'app-add-guarantor',
    styles: [],
    templateUrl: './add-guarantor.component.html'
})
export class AddGuarantorComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    member: GuarantorModel;

    loader = false;

    memberMethods: any = [];

    formGroup: FormGroup;

    members: any = [];
    loans: any = [];

    @ViewChild('stepper', {static: true }) stepper: MatStepper;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private memberService: GuarantorService,
                private notification: NotificationService,

                private memberMethodService: PaymentMethodSettingService,


                private dialogRef: MatDialogRef<AddGuarantorComponent>) {
        this.members = row.members;
        this.loans = row.loans;
    }

    ngOnInit() {

        this.form = this.fb.group({
            member_id: [''],
            loan_id: ['']
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
                  //  console.log('Create Source: ', data);
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! New guarantor created.');
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

