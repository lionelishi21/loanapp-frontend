import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WitnessTypeSettingModel } from '../model/witness-type-setting.model';
import { WitnessTypeSettingService } from '../data/witness-type-setting.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-add-witness-type',
    styles: [],
    templateUrl: './add-witness-type.component.html'
})
export class AddWitnessTypeComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    type: WitnessTypeSettingModel;

    loader = false;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private typeService: WitnessTypeSettingService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<AddWitnessTypeComponent>) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: ['', [Validators.required,
                Validators.minLength(3)]],
            description: [''],
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
    createType() {

        const body = Object.assign({}, this.type, this.form.value);

        this.loader = true;

        this.typeService.create(body)
            .subscribe((data) => {
                    console.log('Create Type: ', data);
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! New type created.');
                },
                (error) => {
                    this.loader = false;
                    if (error.type === 0) {
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
