import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BorrowerStatusSettingModel } from '../model/borrower-status-setting.model';
import { BorrowerStatusSettingService } from '../data/borrower-status-setting.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-edit-borrower-status',
    styles: [],
    templateUrl: './edit-borrower-status.component.html'
})
export class EditBorrowerStatusComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    status: BorrowerStatusSettingModel;

    loader = false;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private statusService: BorrowerStatusSettingService,
                private notification: NotificationService,
    private dialogRef: MatDialogRef<EditBorrowerStatusComponent>) {

        this.status = row.status;

        this.form = fb.group({
            name: [this.status.name, [Validators.required,
                Validators.minLength(3)]],
            description: [this.status.description],
        });
    }

    ngOnInit() {
        //
    }

    close() {
        this.dialogRef.close();
    }

    updateStatus() {
        const body = Object.assign({}, this.status, this.form.value);

        this.loader = true;
        this.statusService.update(body)
            .subscribe((data) => {
                    console.log('Update status: ', data);
                    this.loader = false;

                    this.dialogRef.close(this.form.value);

                    // notify success
                    this.notification.showNotification('success', 'Success !! Status has been updated.');

                },
                (error) => {
                    this.loader = false;
                    console.log('Error at edit status component: ', error);

                    if (error.status === 0) {
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
