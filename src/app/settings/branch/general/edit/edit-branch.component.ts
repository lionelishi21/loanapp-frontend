import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchModel } from '../model/branch.model';
import { BranchService } from '../data/branch.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-edit-branch',
    styles: [],
    templateUrl: './edit-branch.component.html'
})

export class EditBranchComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    branch: BranchModel;

    loader = false;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private branchService: BranchService,
                private notification: NotificationService,
    private dialogRef: MatDialogRef<EditBranchComponent>) {

        this.branch = row.branch;
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: [this.branch.name, [Validators.required,
                Validators.minLength(3)]],
            location: [this.branch.location],
            address: [this.branch.address],
            description: [this.branch.description],
            branch_code: [this.branch.branch_code],
        });
    }

    close() {
        this.dialogRef.close();
    }

    updateBranch() {
        const body = Object.assign({}, this.branch, this.form.value);

        this.loader = true;
        this.branchService.update(body)
            .subscribe((data) => {
                    this.loader = false;

                    this.dialogRef.close(this.form.value);

                    // notify success
                    this.notification.showNotification('success', 'Success !! Branch has been updated.');

                },
                (error) => {
                    this.loader = false;

                    if (error.branch === 0) {
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
