import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommunicationGeneralSettingService } from '../data/communication-general-setting.service';
import { NotificationService } from '../../../../shared/notification.service';
import { CommunicationSettingModel } from '../model/communication-setting.model';

@Component({
    selector: 'app-edit-communication-general',
    styles: [],
    templateUrl: './edit-communication-general.component.html'
})
export class EditCommunicationGeneralComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    communicationSetting: CommunicationSettingModel;

    loader = false;

    options = [
        {id: true, name: 'Yes'},
        {id: false, name: 'No'}
        ];

    emailTemplates: any = [];
    smsTemplates: any = [];

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private communicationGeneralSettingService: CommunicationGeneralSettingService,
                private notification: NotificationService,
    private dialogRef: MatDialogRef<EditCommunicationGeneralComponent>) {

        this.communicationSetting = row.communicationSetting;
        this.emailTemplates = row.emailTemplates;
        this.smsTemplates = row.smsTemplates;

        this.form = fb.group({
            name: [{value: this.communicationSetting.name, disabled: true}, [Validators.required,
                Validators.minLength(3)]],
            display_name: [this.communicationSetting.display_name],
            email_template: [this.communicationSetting.email_template],
            sms_template: [this.communicationSetting.sms_template]
        });
    }

    ngOnInit() {
    }

    close() {
        this.dialogRef.close();
    }

    updateType() {
        const body = Object.assign({}, this.communicationSetting, this.form.value);

        this.loader = true;
        this.communicationGeneralSettingService.update(body)
            .subscribe((data) => {
                    this.loader = false;

                    this.dialogRef.close(this.form.value);

                    // notify success
                    this.notification.showNotification('success', 'Success !! Communication Setting has been updated.');

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
