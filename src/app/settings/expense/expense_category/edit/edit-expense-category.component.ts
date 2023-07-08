import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseCategorySettingModel } from '../model/expense-category-setting.model';
import { ExpenseCategorySettingService } from '../data/expense-category-setting.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-edit-expense-category',
    styles: [],
    templateUrl: './edit-expense-category.component.html'
})
export class EditExpenseCategoryComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    type: ExpenseCategorySettingModel;

    loader = false;

    interestTypes: any = [];

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private typeService: ExpenseCategorySettingService,
                private notification: NotificationService,
    private dialogRef: MatDialogRef<EditExpenseCategoryComponent>) {

        this.type = row.type;
        this.interestTypes = row.interestTypes;


        this.form = fb.group({
            account_name: [this.type.account_name, [Validators.required,
                Validators.minLength(3)]],
            description: [this.type.description]
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
