import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PeriodSettingModel } from '../model/period-setting.model';
import { PeriodSettingService } from '../data/period-setting.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-add-period',
    styles: [],
    templateUrl: './add-period.component.html'
})
export class AddPeriodComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    source: PeriodSettingModel;

    loader = false;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private sourceService: PeriodSettingService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<AddPeriodComponent>) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            start_on: ['', [Validators.required,
                Validators.minLength(3)]],
            end_on: [''],
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
    createSource() {

        const body = Object.assign({}, this.source, this.form.value);

        this.loader = true;

        this.sourceService.create(body)
            .subscribe((data) => {
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! New source created.');
                },
                (error) => {
                    this.loader = false;
                    if (error.source === 0) {
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
