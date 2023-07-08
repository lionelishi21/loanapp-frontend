import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseCategorySettingModel } from '../model/expense-category-setting.model';
import { ExpenseCategorySettingService } from '../data/expense-category-setting.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-add-expense-category',
    styles: [],
    templateUrl: './add-expense-category.component.html'
})
export class AddExpenseCategoryComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    expenseCategory: ExpenseCategorySettingModel;

    loader = false;

    interestTypes: any;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private expenseCategoryService: ExpenseCategorySettingService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<AddExpenseCategoryComponent>) {
        this.interestTypes = row.interestTypes;

    }

    ngOnInit() {
        this.form = this.fb.group({
            account_name: ['', [Validators.required,
                Validators.minLength(3)]],
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

        const body = Object.assign({}, this.expenseCategory, this.form.value);

        this.loader = true;

        this.expenseCategoryService.create(body)
            .subscribe((data) => {
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! New Expense Category created.');
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
