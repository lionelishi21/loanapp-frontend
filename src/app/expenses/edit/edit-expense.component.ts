import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseModel } from '../models/expense-model';
import { ExpenseService } from '../data/expense.service';
import { NotificationService } from '../../shared/notification.service';
import { ExpenseCategorySettingService } from '../../settings/expense/expense_category/data/expense-category-setting.service';

@Component({
    selector: 'app-edit-expense',
    styles: [],
    templateUrl: './edit-expense.component.html'
})
export class EditExpenseComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    expense: ExpenseModel;

    loader = false;

    categories: any = [];
    invoices: any = [];
    clients: any = [];

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private expenseService: ExpenseService,
                private expenseCategoryService: ExpenseCategorySettingService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<EditExpenseComponent>) {

        this.expense = row.data;
        this.categories = row.categories;
    }

    ngOnInit() {
        this.form = this.fb.group({
            category_id: [this.expense.category_id, [Validators.required,
                Validators.minLength(3)]],
            title: [this.expense.title, [Validators.required,
                Validators.minLength(3)]],
            amount: [this.expense.amount, [Validators.required,
                Validators.minLength(1)]],
            expense_date: [this.expense.expense_date],
            notes: [this.expense.notes],
            attachment: []
        });
    }

    close() {
        this.dialogRef.close();
    }

    update() {
        const body = Object.assign({}, this.expense, this.form.value);

        this.loader = true;
        this.expenseService.update(body)
            .subscribe((data) => {
                    this.loader = false;

                    this.dialogRef.close(this.form.value);

                    // notify success
                    this.notification.showNotification('success', 'Success !! Expense has been updated.');

                },
                (error) => {
                    this.loader = false;

                    if (error.expense === 0) {
                        // notify error
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
