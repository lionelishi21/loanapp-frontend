import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PeriodSettingModel } from '../model/period-setting.model';
import { PeriodSettingService } from '../data/period-setting.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-edit-period',
    styles: [],
    templateUrl: './edit-period.component.html'
})
export class EditPeriodComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    fiscalPeriod: PeriodSettingModel;

    loader = false;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private fiscalPeriodService: PeriodSettingService,
                private notification: NotificationService,
    private dialogRef: MatDialogRef<EditPeriodComponent>) {

        this.fiscalPeriod = row.fiscalPeriod;

        this.form = fb.group({
            start_on: [{value: this.fiscalPeriod.start_on, disabled: true}, [Validators.required,
                Validators.minLength(3)]],
            end_on: [this.fiscalPeriod.end_on],
        });
    }

    ngOnInit() {
        //
    }

    close() {
        this.dialogRef.close();
    }

    updateSource() {
        const body = Object.assign({}, this.fiscalPeriod, this.form.value);

        this.loader = true;
        this.fiscalPeriodService.update(body)
            .subscribe((data) => {
                    this.loader = false;

                    this.dialogRef.close(this.form.value);

                    // notify success
                    this.notification.showNotification('success', 'Success !! Source has been updated.');

                },
                (error) => {
                    this.loader = false;

                    if (error.fiscalPeriod === 0) {
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
