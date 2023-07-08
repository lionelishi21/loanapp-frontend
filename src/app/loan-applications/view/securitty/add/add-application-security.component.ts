import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationSecurityService } from '../data/application-security.service';
import { NotificationService } from '../../../../shared/notification.service';
import { CollateralModel } from '../../../../collateral/models/collateral-model';
import * as moment from 'moment';

@Component({
    selector: 'app-add-application-security',
    styles: [],
    templateUrl: './add-application-security.component.html'
})
export class AddApplicationSecurityComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    collateral: CollateralModel;
    memberId: any;

    loader = false;

    members: any;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private methodService: ApplicationSecurityService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<AddApplicationSecurityComponent>) {
        this.memberId = row.id;
    }

    ngOnInit() {
        this.form = this.fb.group({
            title: [''],
            description: [''],
            valuation_date: [moment(), Validators.required],
            valued_by: [''],
            valuer_phone: [''],
            valuation_amount: [''],
            location: [''],
            registration_number: [''],
            registered_to: [''],
            condition: [''],
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
     * Create a resource
     */
    createMethod() {

        const body = Object.assign({}, this.collateral, this.form.value);

        body.member_id = this.memberId;

        this.loader = true;

        this.methodService.create(body)
            .subscribe((data) => {
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! New collateral created.');
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
