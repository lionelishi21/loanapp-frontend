import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WitnessTypeSettingModel } from '../model/witness-type-setting.model';
import { WitnessTypeSettingService } from '../data/witness-type-setting.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-edit-witness-type',
    styles: [],
    templateUrl: './edit-witness-type.component.html'
})
export class EditWitnessTypeComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    type: WitnessTypeSettingModel;

    loader = false;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private typeService: WitnessTypeSettingService,
                private notification: NotificationService,
    private dialogRef: MatDialogRef<EditWitnessTypeComponent>) {

        this.type = row.type;

        this.form = fb.group({
            name: [{value: this.type.name, disabled: true}, [Validators.required,
                Validators.minLength(3)]],
            display_name: [this.type.display_name],
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
                    this.notification.showNotification('success', 'Success !! Type has been updated.');

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
