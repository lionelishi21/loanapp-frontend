import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationGuarantorModel } from '../model/application-guarantor.model';
import { ApplicationGuarantorService } from '../data/application-guarantor.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-edit-application-guarantor',
    styles: [],
    templateUrl: './edit-application-guarantor.component.html'
})
export class EditApplicationGuarantorComponent implements OnInit  {

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
    private dialogRef: MatDialogRef<EditApplicationGuarantorComponent>) {

        this.members = row.members;
        this.guaranteeAmount = row.guaranteeAmount;
        this.applicationId = row.applicationId;
        this.guarantor = row.guarantor;
    }

    ngOnInit() {
        this.nationalID = this.members.find((item: any) => item.id === this.guarantor.member_id).id_number;
        this.accountNumber = this.members.find((item: any) => item.id === this.guarantor.member_id).account.account_number;

        this.form = this.fb.group({
            member_id: [this.guarantor.member_id],
            notes: [this.guarantor.notes],
            loan_application_id: [this.applicationId],
            account_id: [{value: this.accountNumber, disabled: true}],
            id_number: [{value: this.nationalID, disabled: true}],
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

    updateMethod() {
        const body = Object.assign({}, this.guarantor, this.form.value);

        this.loader = true;
        this.methodService.update(body)
            .subscribe((data) => {
                    this.loader = false;

                    this.dialogRef.close(this.form.value);

                    // notify success
                    this.notification.showNotification('success', 'Success !! Guarantor has been updated.');

                },
                (error) => {
                    this.loader = false;
                    if (error.method === 0) {
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
