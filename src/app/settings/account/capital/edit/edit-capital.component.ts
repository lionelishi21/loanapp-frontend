import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CapitalSettingModel } from '../model/capital-setting.model';
import { CapitalSettingService } from '../data/capital-setting.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-edit-capital',
    styles: [],
    templateUrl: './edit-capital.component.html'
})
export class EditCapitalComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    type: CapitalSettingModel;

    loader = false;

    interestTypes: any = [];
    branches: any = [];

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private typeService: CapitalSettingService,
                private notification: NotificationService,
    private dialogRef: MatDialogRef<EditCapitalComponent>) {

        this.branches = row.branches;

        this.type = row.type;
        this.interestTypes = row.interestTypes;


        this.form = fb.group({
            branch_id: ['', [Validators.required,
                Validators.minLength(2)]],
            name: [this.type.name, [Validators.required,
                Validators.minLength(1)]],
            description: [this.type.description],
        });
    }

    ngOnInit() {
        //
    }

    close() {
        this.dialogRef.close();
    }

    updateType() {
        const body = Object.assign({}, this.type, this.form.value);

        this.loader = true;
        this.typeService.update(body)
            .subscribe((data) => {
                    this.loader = false;

                    this.dialogRef.close(this.form.value);

                    // notify success
                    this.notification.showNotification('success', 'Success !! Capital has been updated.');

                },
                (error) => {
                    this.loader = false;

                    if (error.type === 0) {
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
