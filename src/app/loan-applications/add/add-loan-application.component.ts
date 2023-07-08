import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatStepper } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoanApplicationModel } from '../models/loan-application-model';
import { LoanApplicationService } from '../data/loan-application.service';

import { NotificationService } from '../../shared/notification.service';
import { PaymentMethodSettingService } from '../../settings/payment/method/data/payment-method-setting.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, delay, tap, filter, takeUntil } from 'rxjs/operators';

import { Router } from '@angular/router';
import { LoanTypeSettingService } from '../../settings/loan/type/data/loan-type-setting.service';
import { MemberService } from '../../members/data/member.service';
import * as moment from 'moment';
import { WitnessTypeSettingService } from '../../settings/borrower/witness-type/data/witness-type-setting.service';

import { ReplaySubject, Subject } from 'rxjs';

@Component({
    selector: 'app-add-loan-application',
    styles: [],
    templateUrl: './add-loan-application.component.html'
})
export class AddLoanApplicationComponent implements OnInit, OnDestroy  {

    form: FormGroup;

    formErrors: any;

    loanApplication: LoanApplicationModel;

    loader = false;
    isMpesa = false;
    isBank = false;

    formGroup: FormGroup;

    isLinear = true;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    fourthFormGroup: FormGroup;

    leadStatuses: any = [];

    loanTypes: any = [];
    members: any = [];
    users: any = [];
    accounts: any = [];
    memberAccounts: any = [];

    userPhone = '';
    lastName = '';

    nationalID = '';

    accountNumber = '';
    interestRate = '';
    interestType = '';
    interestTypeId = '';
    serviceFee: any;

    penaltyTypeId: any;
    penaltyValue: any;
    penaltyFrequencyId: any;

    reducePrincipalEarly: boolean;

    repaymentPeriod = '';
    repaymentFrequency = '';
    repaymentFrequencyId: any;

    paymentMethods: any;
    witnessTypes: any;

    fileToUpload: File = null;
    fileUrl = '';

    applicationFormToUpload: File = null;
    applicationFormUrl = '';

    options: string[] = ['One', 'Two', 'Three', 'Five'];
    filteredOptions: Observable<string[]>;

    @ViewChild('stepper', {static: true }) stepper: MatStepper;


    /** control for the selected bank for server side filtering */
    public bankServerSideCtrl: FormControl = new FormControl();

    /** control for filter for server side. */
    public memberServerSideFilteringCtrl: FormControl = new FormControl();

    /** indicate search operation is in progress */
    public searching: boolean = false;

    /** list of banks filtered after simulating server side search */
    public  filteredServerSideMembers: ReplaySubject<any> = new ReplaySubject<any>(1);

    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();


    constructor(@Inject(MAT_DIALOG_DATA) row: any,
        private fb: FormBuilder, private router: Router, private memberService: MemberService,
                private witnessTypeService: WitnessTypeSettingService,
                private loanTypeService: LoanTypeSettingService, private paymentMethodService: PaymentMethodSettingService,
                private notification: NotificationService, private loanApplicationService: LoanApplicationService,
                private memberMethodService: PaymentMethodSettingService, private dialogRef: MatDialogRef<AddLoanApplicationComponent>) {
        this.members = row.members;
        this.users = row.users;
        this.loanTypes = row.loanTypes;
    }

    ngOnInit() {
        // listen for search field value changes
        this.memberServerSideFilteringCtrl.valueChanges
            .pipe(
                filter(search => !!search),
                tap(() => this.searching = true),
                takeUntil(this._onDestroy),
                debounceTime(200),
                distinctUntilChanged(),
                map(search => {
                    if (!this.members) {
                        return [];
                    }
                    search = search.toLowerCase();
                    // simulate server fetching and filtering data
                    return this.members.filter(member => {
                           return member.first_name.toLowerCase().indexOf(search) > -1
                               || member.middle_name.toLowerCase().indexOf(search) > -1
                               || member.last_name.toLowerCase().indexOf(search) > -1
                               || member.phone.toLowerCase().indexOf(search) > -1
                               || member.id_number.toLowerCase().indexOf(search) > -1;
                        });
                }),
                delay(500)
            )
            .subscribe(filteredMembers => {
                    this.searching = false;
                    this.filteredServerSideMembers.next(filteredMembers);
                },
                error => {
                    this.searching = false;
                });

        this.firstFormGroup = this.fb.group({
            member_id: ['', Validators.required],
            loan_officer_id: ['', Validators.required],
            loan_type_id: ['', Validators.required],

            account_id: [{value: '', disabled: true}],
            id_number: [{value: '', disabled: true}],

            last_name: [{value: '', disabled: true}],
            phone: [{value: '', disabled: true}],

            interest_rate: [{value: '', disabled: true}],
            repayment_period: [{value: '', disabled: true}],
            payment_frequency: [{value: '', disabled: true}],

            application_date: [moment(), Validators.required],
            amount_applied: ['', Validators.required],
        });

        this.secondFormGroup = this.fb.group({
            disburse_method_id: ['', Validators.required],
            bank_name: [''],
            bank_branch: [''],
            bank_account: [''],
            disburse_note: [''],

            bank_fields: this.fb.group({
                cheque_number: [''],
                cheque_date: [moment(), Validators.required],
                bank_name: [''],
                bank_branch: ['']
            }),
            mpesa_fields: this.fb.group({
                mpesa_number: [''],
                mpesa_first_name: [''],
                mpesa_last_name: ['']
            })
        });

        this.thirdFormGroup = this.fb.group({
            witness_type_id: [''],
            witness_first_name: [''],
            witness_last_name: [''],
            witness_country: [''],
            witness_county: [''],
            witness_city: [''],
            witness_national_id: [''],
            witness_phone: [''],
            witness_email: [''],
            witness_postal_address: [''],
            witness_residential_address: ['']
        });

        this.fourthFormGroup = this.fb.group({
        });

        this.paymentMethodService.list(['name', 'display_name'])
            .subscribe((res) => this.paymentMethods = res,
                () => this.paymentMethods = []
            );

        this.witnessTypeService.list(['name', 'display_name'])
            .subscribe((res) => this.witnessTypes = res,
                () => this.witnessTypes = []
            );

    }

    /**
     *
     * @param file
     */
    onFileSelect(file: FileList) {
        if (file.length > 0) {
            this.fileToUpload = file.item(0);
            const reader = new FileReader();
            reader.onload = (event: any) => {
                this.fileUrl = event.target.result;
            };
            reader.readAsDataURL(this.fileToUpload);
        }
    }

    /**
     *
     * @param event
     */
    fileChange(event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
        }
    }

    /**
     *
     * @param file
     */
    applicationFormUpload(file: FileList) {

        if (file.length > 0) {
            this.applicationFormToUpload = file.item(0);

            const reader = new FileReader();

            reader.onload = (event: any) => {
                this.applicationFormUrl = event.target.result;
            };

            reader.readAsDataURL(this.applicationFormToUpload);
        }
    }

    /**
     * Update supporting fields when member drop down changes content
     * @param value
     */
    onItemChange(value) {
        this.nationalID = this.members.find((item: any) => item.id === value).id_number;
        this.accountNumber = this.members.find((item: any) => item.id === value).account.account_number;
        this.memberAccounts = this.accounts.filter((item: any) => item.member_id === value);

        this.firstFormGroup.patchValue({
            id_number: this.nationalID,
            account_id: this.accountNumber,
        });
    }

    /**
     * Update supporting fields when LoanOfficer drop down changes content
     * @param value
     */
    onLoanOfficerItemChange(value) {
        this.lastName = this.users.find((item: any) => item.id === value).last_name;
        this.userPhone = this.users.find((item: any) => item.id === value).phone;

        this.firstFormGroup.patchValue({
            last_name: this.lastName,
            phone: this.userPhone,
        });
    }

    /**
     * Update supporting fields when Loan Type drop down changes content
     * @param value
     */
    onLoanTypeItemChange(value) {
        this.interestRate = this.loanTypes.find((item: any) => item.id === value).interest_rate;
        this.interestType = this.loanTypes.find((item: any) => item.id === value).interest_type.display_name;
        this.interestTypeId = this.loanTypes.find((item: any) => item.id === value).interest_type.id;
        this.serviceFee = this.loanTypes.find((item: any) => item.id === value).service_fee;

        this.penaltyTypeId = this.loanTypes.find((item: any) => item.id === value).penalty_type_id;
        this.penaltyValue = this.loanTypes.find((item: any) => item.id === value).penalty_value;
        this.penaltyFrequencyId = this.loanTypes.find((item: any) => item.id === value).penalty_frequency_id;

        this.repaymentPeriod = this.loanTypes.find((item: any) => item.id === value).repayment_period;
        this.repaymentFrequency = this.loanTypes.find((item: any) => item.id === value).payment_frequency.display_name;
        this.repaymentFrequencyId = this.loanTypes.find((item: any) => item.id === value).payment_frequency.id;

        this.reducePrincipalEarly = this.loanTypes.find((item: any) => item.id === value).reduce_principal_early;

        this.firstFormGroup.patchValue({
            interest_rate: this.interestRate +  ' ( ' + this.interestType + ' )',
            repayment_period: this.repaymentPeriod,
            payment_frequency: this.repaymentFrequency
        });

    }

    /**
     *
     * @param value
     */
    onDisburseMethodItemChange(value) {
        const paymentMethod = this.paymentMethods.find((item: any) => item.id === value).name;
        this.isMpesa = paymentMethod === 'MPESA';
        this.isBank = paymentMethod === 'BANK';
    }

    save() {
    }

    close() {
        this.dialogRef.close();
    }

    /**
     * Create loanApplication
     */
    create() {

        const data = {...this.firstFormGroup.value, ...this.secondFormGroup.value, ...this.thirdFormGroup.value};

        const body = Object.assign({}, this.loanApplication, data);
        body.interest_rate = this.interestRate;
        body.interest_type_id = this.interestTypeId;
        body.service_fee = this.serviceFee;

        body.penalty_type_id = this.penaltyTypeId;
        body.penalty_value = this.penaltyValue;
        body.penalty_frequency_id = this.penaltyFrequencyId;

        body.repayment_period = this.repaymentPeriod;
        body.payment_frequency_id = this.repaymentFrequencyId;
        body.reduce_principal_early = this.reducePrincipalEarly;

        body.mpesa_number = this.secondFormGroup.get('mpesa_fields.mpesa_number').value;
        body.mpesa_first_name = this.secondFormGroup.get('mpesa_fields.mpesa_first_name').value;
        body.mpesa_last_name = this.secondFormGroup.get('mpesa_fields.mpesa_last_name').value;

        body.cheque_number = this.secondFormGroup.get('bank_fields.cheque_number').value;
        body.cheque_date = this.secondFormGroup.get('bank_fields.cheque_date').value;
        body.bank_name = this.secondFormGroup.get('bank_fields.bank_name').value;
        body.bank_branch = this.secondFormGroup.get('bank_fields.bank_branch').value;

        const formData = new FormData();
        if(this.applicationFormToUpload != null)
            formData.append('attach_application_form', this.applicationFormToUpload);

        for (const key in body) {
            if (body.hasOwnProperty(key)) {
                formData.append(key, body[key]);
            }
        }

        this.loader = true;
        this.loanApplicationService.create(formData)
            .subscribe((res) => {
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! New Loan Application.');
                },
                (error) => {
                    this.loader = false;
                    if (error.lead === 0) {
                        this.notification.showNotification('danger', 'Connection Error !! Nothing created.' +
                            ' Check your connection and retry.');
                        return;
                    }
                    // An array of all form errors as returned by server
                    this.formErrors = error;

                    if (this.formErrors) {
                        // loop through from fields, If has an error, mark as invalid so mat-error can show
                        for (const prop in this.formErrors) {
                            this.stepper.selectedIndex = 0;

                            if (this.thirdFormGroup.controls[prop]) {
                                this.thirdFormGroup.controls[prop].setErrors({incorrect: true});
                            }
                            if (this.secondFormGroup.controls[prop]) {
                                this.secondFormGroup.controls[prop].setErrors({incorrect: true});
                            }
                            if (this.firstFormGroup.controls[prop]) {
                                this.firstFormGroup.controls[prop].setErrors({incorrect: true});
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
        this.dialogRef.close(this.firstFormGroup.value);
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

}

