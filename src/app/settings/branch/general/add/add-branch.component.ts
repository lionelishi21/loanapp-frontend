import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchModel } from '../model/branch.model';
import { BranchService } from '../data/branch.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-add-branch',
    styles: [],
    templateUrl: './add-branch.component.html'
})
export class AddBranchComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    branch: BranchModel;

    loader = false;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private branchService: BranchService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<AddBranchComponent>) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: ['', [Validators.required,
                Validators.minLength(3)]],
            branch_code: ['', [Validators.required,
                Validators.minLength(2)]],
            location: [''],
            description: [''],
            address: [''],
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
    createBranch() {

        const body = Object.assign({}, this.branch, this.form.value);

        this.loader = true;

        this.branchService.create(body)
            .subscribe((data) => {
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! New branch created.');
                },
                (error) => {
                    this.loader = false;
                    if (error.branch === 0) {
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
