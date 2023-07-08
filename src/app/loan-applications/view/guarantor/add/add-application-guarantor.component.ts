import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApplicationGuarantorModel } from '../model/application-guarantor.model';
import { ApplicationGuarantorService } from '../data/application-guarantor.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-add-application-guarantor',
    styles: [],
    templateUrl: './add-application-guarantor.component.html'
})
export class AddApplicationGuarantorComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    guarantor: ApplicationGuarantorModel;

    loader = false;

    members: any;
    guaranteeAmount: any;
    applicationId: any;

    nationalID = '';
    accountNumber = '';

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private methodService: ApplicationGuarantorService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<AddApplicationGuarantorComponent>) {
        this.members = row.members;
        this.guaranteeAmount = row.guaranteeAmount;
        this.applicationId = row.applicationId;
    }

    ngOnInit() {
        this.form = this.fb.group({
            member_id: [''],
            notes: [''],
            loan_application_id: [this.applicationId],
            account_id: [{value: '', disabled: true}],
            id_number: [{value: '', disabled: true}],
        });
    }

    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }

    /**
     * Update supporting fields when member drop down changes content
     * @param value
     */
    onItemChange(value) {
        this.nationalID = this.members.find((item: any) => item.id === value).id_number;
        this.accountNumber = this.members.find((item: any) => item.id === value).account.account_number;

        this.form.patchValue({
            id_number: this.nationalID,
            account_id: this.accountNumber,
        });
    }

    /**
     * Create a resource
     */
    createMethod() {

        const body = Object.assign({}, this.guarantor, this.form.value);

        this.loader = true;

        this.methodService.create(body)
            .subscribe((data) => {
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! New Guarantor Added to Loan.');
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
                          //  console.log('Hallo: ' , prop);
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
