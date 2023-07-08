import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeModel } from '../model/employee.model';
import { EmployeeService } from '../data/employee.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-edit-employee',
    styles: [],
    templateUrl: './edit-employee.component.html'
})

export class EditEmployeeComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    employee: EmployeeModel;

    loader = false;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private branchService: EmployeeService,
                private notification: NotificationService,
    private dialogRef: MatDialogRef<EditEmployeeComponent>) {

        this.employee = row.employee;
    }

    ngOnInit() {
        this.form = this.fb.group({
            employee_number: [this.employee.employee_number],
            first_name: [this.employee.first_name, [Validators.required,
                Validators.minLength(3)]],
            last_name: [this.employee.last_name],
            gender: [this.employee.gender],
            salutation: [this.employee.salutation],
            national_id_number: [this.employee.national_id_number],
            passport_number: [this.employee.passport_number],
            email: [this.employee.email],
            telephone_number: [this.employee.telephone_number],
            address: [this.employee.address],
            postal_code: [this.employee.postal_code],
            country: [this.employee.country],
            county: [this.employee.county],
            city: [this.employee.city],
            nhif_number: [this.employee.nhif_number],
            nssf_number: [this.employee.nssf_number],
            kra_pin: [this.employee.kra_pin],
            job_group: [this.employee.job_group],
            designation_id: [this.employee.designation_id],
            department_id: [this.employee.department_id],
            birth_day: [this.employee.birth_day],
            profile_picture: [this.employee.profile_picture],
            national_id_image: [this.employee.national_id_image],
        });
    }

    close() {
        this.dialogRef.close();
    }

    updateBranch() {
        const body = Object.assign({}, this.employee, this.form.value);

        this.loader = true;
        this.branchService.update(body)
            .subscribe((data) => {
                    console.log('Update employee: ', data);
                    this.loader = false;

                    this.dialogRef.close(this.form.value);

                    // notify success
                    this.notification.showNotification('success', 'Success !! Employee has been updated.');

                },
                (error) => {
                    this.loader = false;
                    console.log('Error at edit employee component: ', error);

                    if (error.employee === 0) {
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
