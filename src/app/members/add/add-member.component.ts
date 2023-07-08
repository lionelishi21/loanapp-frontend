import { Component, ElementRef, Inject, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatStepper } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberModel } from '../models/member-model';
import { MemberService } from '../data/member.service';

import { NotificationService } from '../../shared/notification.service';
import { PaymentMethodSettingService } from '../../settings/payment/method/data/payment-method-setting.service';
import * as moment from 'moment';

@Component({
    selector: 'app-add-member',
    styles: [],
    templateUrl: './add-member.component.html'
})
export class AddMemberComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    member: MemberModel;

    loader = false;

    memberMethods: any = [];

    formGroup: FormGroup;

    memberStatuses: any = [];
    memberSources: any = [];
    memberTypes: any = [];
    branches: any = [];

    profilePicFileToUpload: File = null;
    membershipFormFileToUpload: File = null;
    profilePicUrl = '';

    membershipFormToUpload: File = null;
    membershipFormUrl = '';

    urls = new Array<string>();

    @ViewChild('stepper', {static: true }) stepper: MatStepper;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private memberService: MemberService,
                private notification: NotificationService,
                private memberMethodService: PaymentMethodSettingService,
                private dialogRef: MatDialogRef<AddMemberComponent>) {
        this.branches = row.branches;
    }

    ngOnInit() {

        this.memberMethodService.list('name')
            .subscribe((res) => this.memberMethods = res,
                () => this.memberMethods = []
            );

        this.form = this.fb.group({
            first_name: ['', [Validators.required,
                Validators.minLength(2)]],
            middle_name: ['', [Validators.required,
                Validators.minLength(2)]],
            last_name: [''],
            nationality: ['', [Validators.required,
                Validators.minLength(2)]],
            id_number: ['', [Validators.required,
                Validators.minLength(2)]],
            passport_number: [''],
            phone: ['', [Validators.required,
                Validators.minLength(2)]],
            email: [''],
            postal_address: ['', [Validators.required,
                Validators.minLength(2)]],
            residential_address: ['', [Validators.required,
                Validators.minLength(2)]],
            county: [''],
            city: [''],
            status_id: [''],
            date_of_birth: ['', [Validators.required,
                Validators.minLength(2)]],
            date_became_member: [moment(), Validators.required]
        });
    }

    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }

    /**
     *
     * @param event
     */
    detectFiles(event) {
        this.urls = [];
        let files = event.target.files;
        if (files) {
            for (let file of files) {
                let reader = new FileReader();
                reader.onload = (e: any) => {
                    this.urls.push(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        }
    }

    /**
     *
     * @param file
     */
    handleFileInput(file: FileList) {
        this.profilePicFileToUpload = file.item(0);

        const reader = new FileReader();

        reader.onload = (event: any) => {
            this.profilePicUrl = event.target.result;
        };

        reader.readAsDataURL(this.profilePicFileToUpload);
    }

    /**
     *
     * @param file
     */
    onProfilePicSelect(file: FileList) {

        if (file.length > 0) {
            this.profilePicFileToUpload = file.item(0);

            const reader = new FileReader();

            reader.onload = (event: any) => {
                this.profilePicUrl = event.target.result;
            };
            reader.readAsDataURL(this.profilePicFileToUpload);
        }
    }

    /**
     *
     * @param file
     */
    onMembershipFormInputSelect(file: FileList) {

        if (file.length > 0) {
            this.membershipFormFileToUpload = file.item(0);

            const reader = new FileReader();

            reader.onload = (event: any) => {
                this.membershipFormUrl = event.target.result;
            };

            reader.readAsDataURL(this.membershipFormFileToUpload);
        }
    }

    /**
     *
     * @param event
     */
    onFileSelect(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.form.get('passport_photo').setValue(file);
        }
    }

    /**
     *
     * @param file
     */
    membershipFormUpload(file: FileList) {

        if (file.length > 0) {
            this.membershipFormToUpload = file.item(0);

            const reader = new FileReader();

            reader.onload = (event: any) => {
                this.membershipFormUrl = event.target.result;
            };
            reader.readAsDataURL(this.membershipFormToUpload);
        }
    }

    /**
     * Create member
     */
    create() {

        const body = Object.assign({}, this.member, this.form.value);

        const formData = new FormData();
        if(this.profilePicFileToUpload != null)
            formData.append('passport_photo', this.profilePicFileToUpload);
        if(this.membershipFormToUpload != null)
            formData.append('membership_form', this.membershipFormToUpload);

        for (const key in body) {
            if (body.hasOwnProperty(key)) {
                formData.append(key, body[key]);
            }
        }
        this.loader = true;

        this.memberService.create(formData)
            .subscribe((data) => {
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! New member created.');
                },
                (error) => {
                    this.loader = false;
                    if (error.member === 0) {
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

