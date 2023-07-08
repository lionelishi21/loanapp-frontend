import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanSourceSettingModel } from '../model/loan-source-setting.model';
import { LoanSourceSettingService } from '../data/loan-source-setting.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-edit-loan-source',
    styles: [],
    templateUrl: './edit-loan-source.component.html'
})
export class EditLoanSourceComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    source: LoanSourceSettingModel;

    loader = false;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private sourceService: LoanSourceSettingService,
                private notification: NotificationService,
    private dialogRef: MatDialogRef<EditLoanSourceComponent>) {

        this.source = row.source;

        this.form = fb.group({
            name: [this.source.name, [Validators.required,
                Validators.minLength(3)]],
            description: [this.source.description],
        });
    }

    ngOnInit() {
        //
    }

    close() {
        this.dialogRef.close();
    }

    updateSource() {
        const body = Object.assign({}, this.source, this.form.value);

        this.loader = true;
        this.sourceService.update(body)
            .subscribe((data) => {
                    this.loader = false;

                    this.dialogRef.close(this.form.value);

                    // notify success
                    this.notification.showNotification('success', 'Success !! Source has been updated.');

                },
                (error) => {
                    this.loader = false;

                    if (error.source === 0) {
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
