import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatStepper } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseModel } from '../models/expense-model';
import { ExpenseService } from '../data/expense.service';

import { NotificationService } from '../../shared/notification.service';
import * as moment from 'moment';

@Component({
    selector: 'app-add-expense',
    styles: [],
    templateUrl: './add-expense.component.html'
})
export class AddExpenseComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    expense: ExpenseModel;

    loader = false;

    categories: any = [];
    accounts: any = [];
    invoices: any = [];
    clients: any = [];

    isLinear = true;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;

    formGroup: FormGroup;

    paymentStatuses: any = [];
    paymentSources: any = [];
    paymentTypes: any = [];

    firstName: any;

    @ViewChild('stepper', {static: true }) stepper: MatStepper;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private expenseService: ExpenseService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<AddExpenseComponent>) {
        this.categories = row.categories;
    }

    ngOnInit() {

        this.form = this.fb.group({
            category_id: ['', [Validators.required,
                Validators.minLength(3)]],
            title: ['', [Validators.required,
                Validators.minLength(3)]],
            amount: ['', [Validators.required,
                Validators.minLength(1)]],
            expense_date: [moment(), Validators.required],
            notes: [''],
            attachment: ['']
        });
    }

    /**
     * Update supporting fields when member drop down changes content
     * @param value
     */
    onAccountItemChange(value) {
        this.firstName = this.accounts.find((item: any) => item.id === value).member.first_name;

        this.form.patchValue({
            first_name: this.firstName
        });
    }

    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }

    create() {

        const body = Object.assign({}, this.expense, this.form.value);
        this.loader = true;

        this.expenseService.create(body)
            .subscribe((data) => {
                   // console.log('Create Source: ', data);
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! New expense created.');
                },
                (error) => {
                    this.loader = false;
                   // console.log('error ');
                   // console.log(error);

                    if (error.expense === 0) {
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

