import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeModel } from '../model/employee.model';
import { EmployeeService } from '../data/employee.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-add-employee',
    styles: [],
    templateUrl: './add-employee.component.html'
})
export class AddEmployeeComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    employee: EmployeeModel;

    loader = false;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private branchService: EmployeeService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<AddEmployeeComponent>) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            employee_number: [''],
            first_name: ['', [Validators.required,
                Validators.minLength(3)]],
            last_name: [''],
            gender: [''],
            salutation: [''],
            national_id_number: [''],
            passport_number: [''],
            email: [''],
            telephone_number: [''],
            address: [''],
            postal_code: [''],
            country: [''],
            county: [''],
            city: [''],
            nhif_number: [''],
            nssf_number: [''],
            kra_pin: [''],
            job_group: [''],
            designation_id: [''],
            department_id: [''],
            birth_day: [''],
            profile_picture: [''],
            national_id_image: [''],
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
    createEmployee() {

        const body = Object.assign({}, this.employee, this.form.value);

        this.loader = true;

        this.branchService.create(body)
            .subscribe((data) => {
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! New employee created.');
                },
                (error) => {
                    this.loader = false;
                    if (error.employee === 0) {
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
