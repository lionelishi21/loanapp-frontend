import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../../shared/notification.service';
import { CollateralService } from '../../../../collateral/data/collateral.service';
import { CollateralModel } from '../../../../collateral/models/collateral-model';
import * as moment from 'moment';

@Component({
    selector: 'app-edit-application-security',
    styles: [],
    templateUrl: './edit-application-security.component.html'
})
export class EditApplicationSecurityComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    collateral: CollateralModel;

    loader = false;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private collateralService: CollateralService,
                private notification: NotificationService,
    private dialogRef: MatDialogRef<EditApplicationSecurityComponent>) {

        this.collateral = row.collateral;

        this.form = this.fb.group({
            title: [this.collateral.title, [Validators.required,
                Validators.minLength(3)]],
            description: [this.collateral.description, [Validators.required,
                Validators.minLength(3)]],
            valuation_date: [this.collateral.valuation_date, [Validators.required,
                Validators.minLength(3)]],
            valued_by: [this.collateral.valued_by, [Validators.required,
                Validators.minLength(3)]],
            valuer_phone: [this.collateral.valuer_phone, [Validators.required,
                Validators.minLength(3)]],
            valuation_amount: [this.collateral.valuation_amount, [Validators.required,
                Validators.minLength(3)]],
            location: [this.collateral.location, [Validators.required,
                Validators.minLength(3)]],
            registration_number: [this.collateral.registration_number, [Validators.required,
                Validators.minLength(3)]],
            registered_to: [this.collateral.registered_to, [Validators.required,
                Validators.minLength(3)]],
            condition: [this.collateral.condition, [Validators.required,
                Validators.minLength(3)]],
            notes: [this.collateral.notes],
        });
    }

    ngOnInit() {
        //
    }

    close() {
        this.dialogRef.close();
    }

    updateMethod() {
        const body = Object.assign({}, this.collateral, this.form.value);

        this.loader = true;
        this.collateralService.update(body)
            .subscribe((data) => {
                  //  console.log('Update method: ', data);
                    this.loader = false;

                    // this.loadData();
                    this.dialogRef.close(this.form.value);

                    // notify success
                    this.notification.showNotification('success', 'Success !! Collateral has been updated.');

                },
                (error) => {
                    this.loader = false;
                  //  console.log('Error at edit method component: ', error);

                    if (error.method === 0) {
                        // notify error
                        return;
                    }
                    // An array of all form errors as returned by server
                   this.formErrors = error;

                    if (this.formErrors) {
                        // loop through from fields, If has an error, mark as invalid so mat-error can show
                        for (const prop in this.formErrors) {
                          //  console.log('Hallo: ', prop);
                            if (this.form) {
                                this.form.controls[prop].setErrors({incorrect: true});
                            }
                        }
                    }
                });
    }

}
