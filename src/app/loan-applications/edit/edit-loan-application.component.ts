import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatStepper } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoanApplicationModel } from '../models/loan-application-model';
import { LoanApplicationService } from '../data/loan-application.service';
import { NotificationService } from '../../shared/notification.service';
import { PaymentMethodSettingService } from '../../settings/payment/method/data/payment-method-setting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { MemberService } from '../../members/data/member.service';
import { LoanTypeSettingService } from '../../settings/loan/type/data/loan-type-setting.service';
import { WitnessTypeSettingService } from '../../settings/borrower/witness-type/data/witness-type-setting.service';
import * as moment from '../../withdrawals/add/add-withdrawal.component';
import { debounceTime, distinctUntilChanged, map, delay, tap, filter, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-edit-loan-application',
    styles: [],
    templateUrl: './edit-loan-application.component.html'
})
export class EditLoanApplicationComponent implements OnInit, AfterViewInit, OnDestroy  {

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
    witnessTypes: any = [];
    disburseMethods: any = [];
    accounts: any = [];
    memberAccounts: any = [];

    nationalID = '';

    userPhone = '';
    lastName = '';

    accountNumber = '';
    interestRate = '';
    interestType = '';
    interestTypeId = '';
    serviceFee: any;
    repaymentPeriod = '';

    penaltyTypeId: any;
    penaltyValue: any;
    penaltyFrequencyId: any;
    reducePrincipalEarly: boolean;

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
                private loanTypeService: LoanTypeSettingService,
                private notification: NotificationService, private loanApplicationService: LoanApplicationService,
                private memberMethodService: PaymentMethodSettingService,
                private paymentMethodService: PaymentMethodSettingService,
                private witnessTypeService: WitnessTypeSettingService,
                private dialogRef: MatDialogRef<EditLoanApplicationComponent>) {
        this.loanApplication = row.loanApplication;
        this.members = row.members;
        this.users = row.users;
        this.loanTypes = row.loanTypes;

        this.filteredServerSideMembers.next( this.members.filter(member =>
            member.first_name.toLowerCase().indexOf(this.loanApplication.member_id) > -1)
        );

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

        this.nationalID = this.members.find((item: any) => item.id === this.loanApplication.member_id).id_number;
        this.accountNumber = this.members.find((item: any) => item.id === this.loanApplication.member_id).account.account_number;

        this.lastName = this.users.find((item: any) => item.id === this.loanApplication.loan_officer_id).last_name;
        this.userPhone = this.users.find((item: any) => item.id === this.loanApplication.loan_officer_id).phone;

        this.interestRate = this.loanTypes.find((item: any) => item.id === this.loanApplication.loan_type_id).interest_rate;
        this.interestType = this.loanTypes.find((item: any) => item.id === this.loanApplication.loan_type_id).interest_type.display_name;
        this.interestTypeId = this.loanTypes.find((item: any) => item.id === this.loanApplication.loan_type_id).interest_type.id;

        this.penaltyTypeId = this.loanTypes.find((item: any) => item.id === this.loanApplication.loan_type_id).penalty_type_id;
        this.penaltyValue = this.loanTypes.find((item: any) => item.id === this.loanApplication.loan_type_id).penalty_value;
        this.penaltyFrequencyId = this.loanTypes.find((item: any) => item.id === this.loanApplication.loan_type_id).penalty_frequency_id;

        this.reducePrincipalEarly = this.loanTypes.find((item: any) => item.id === this.loanApplication.loan_type_id).reduce_principal_early;


        this.serviceFee = this.loanTypes.find((item: any) => item.id === this.loanApplication.loan_type_id).service_fee;
        this.repaymentPeriod = this.loanTypes.find((item: any) => item.id === this.loanApplication.loan_type_id).repayment_period;

        this.paymentMethodService.list(['name', 'display_name'])
            .subscribe((res) => {
                    this.disburseMethods = res;
                    this.onDisburseMethodItemChange(this.loanApplication.disburse_method_id);
                },
                () => this.disburseMethods = []
            );

        this.witnessTypeService.list(['name', 'display_name'])
            .subscribe((res) => this.witnessTypes = res,
                () => this.witnessTypes = []
            );


        this.firstFormGroup = this.fb.group({
            member_id: [this.loanApplication.member_id, [Validators.required,
                Validators.minLength(3)]],
            loan_officer_id: [this.loanApplication.loan_officer_id, [Validators.required,
                Validators.minLength(3)]],
            loan_type_id: [this.loanApplication.loan_type_id, [Validators.required,
                Validators.minLength(3)]],
            account_id: [{value: this.accountNumber, disabled: true}],

            id_number: [{value: this.nationalID, disabled: true}],

            last_name: [{value: this.lastName, disabled: true}],
            phone: [{value: this.userPhone, disabled: true}],

            interest_rate: [{value: this.interestRate, disabled: true}],
            interest_type: [{value: this.interestType, disabled: true}],
            repayment_period: [{value: this.repaymentPeriod, disabled: true}],

            payment_frequency: [{value: this.loanApplication.payment_frequency, disabled: true}],

            application_date: [this.loanApplication.application_date, [Validators.required]],
            amount_applied: [this.loanApplication.amount_applied, [Validators.required]],
        });

        this.secondFormGroup = this.fb.group({
            disburse_method_id: [this.loanApplication.disburse_method_id],
            mpesa_number: [this.loanApplication.mpesa_number],
            mpesa_first_name: [this.loanApplication.mpesa_first_name],
            bank_name: [this.loanApplication.bank_name],
            bank_branch: [this.loanApplication.bank_branch],
            bank_account: [this.loanApplication.bank_account],
            disburse_note: [this.loanApplication.disburse_note],

            bank_fields: this.fb.group({
                cheque_number: [this.loanApplication.cheque_number],
                cheque_date: [this.loanApplication.cheque_date],
                bank_name: [this.loanApplication.bank_name],
                bank_branch: [this.loanApplication.bank_branch]
            }),
            mpesa_fields: this.fb.group({
                mpesa_number: [this.loanApplication.mpesa_number],
                mpesa_first_name: [this.loanApplication.mpesa_first_name],
                mpesa_last_name: [this.loanApplication.mpesa_last_name]
            })
        });

        this.thirdFormGroup = this.fb.group({
            witness_type_id: [this.loanApplication.witness_type_id],
            witness_first_name: [this.loanApplication.witness_first_name],
            witness_last_name: [this.loanApplication.witness_last_name],
            witness_country: [this.loanApplication.witness_country],
            witness_county: [this.loanApplication.witness_county],
            witness_city: [this.loanApplication.witness_city],
            witness_national_id: [this.loanApplication.witness_national_id],
            witness_phone: [this.loanApplication.witness_phone],
            witness_email: [this.loanApplication.witness_email],
            witness_postal_address: [this.loanApplication.witness_postal_address],
            witness_residential_address: [this.loanApplication.witness_residential_address]
        });

        this.fourthFormGroup = this.fb.group({
            application_form: [{value: this.loanApplication.attach_application_form, disabled: true}],
            attach_application_form: [''],
        });


        this.firstFormGroup.patchValue({
            member_id: this.loanApplication.member_id,
        });

    }

    /**
     *
     */
    ngAfterViewInit() {

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
        this.repaymentPeriod = this.loanTypes.find((item: any) => item.id === value).max_period_in_months;

        this.firstFormGroup.patchValue({
            interest_rate: this.interestRate,
            interest_type: this.interestType,
            max_period_in_months: this.repaymentPeriod
        });

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

            const formData = new FormData();
            formData.append('attach_application_form', this.applicationFormToUpload);
            formData.append('id',  this.loanApplication.id);

            // Upload Form
            this.updateApplicationForm(formData);

        }
    }

    /**
     *
     * @param formData
     */
    private updateApplicationForm(formData: FormData) {
        // Upload photo
        this.loanApplicationService.updateApplicationForm(formData)
            .subscribe((data) => {
                    this.loader = false;
                  //  this.getImageFromService();
                    // notify success
                    this.notification.showNotification('success', 'Success !! Application Form has been replaced.');
                },
                (error) => {
                    this.loader = false;
                    this.notification.showNotification('danger', 'Error !! Unable to upload Application Form. File too large?');
                  //  console.log('Error at Application Form update: ', error);
                    if (error.payment === 0) {
                        // notify error
                        return;
                    }
                    // An array of all form errors as returned by server
                    this.formErrors = error;

                    if (this.formErrors) {
                        // loop through from fields, If has an error, mark as invalid so mat-error can show
                        for (const prop in this.formErrors) {
                          //  console.log('Hallo: ', prop);
                            if (this.form) {
                                this.form.controls[prop].setErrors({incorrect: true});
                            }
                        }
                    }
                });
    }

    /**
     *
     * @param value
     */
    onDisburseMethodItemChange(value) {
        const paymentMethod = this.disburseMethods.find((item: any) => item.id === value).name;
        this.isMpesa = paymentMethod === 'MPESA';
        this.isBank = paymentMethod === 'BANK';
    }

    /**
     *
     */
    update() {
        const data = {...this.firstFormGroup.value, ...this.secondFormGroup.value, ...this.thirdFormGroup.value};
        const body = Object.assign({}, this.loanApplication, data);
        body.interest_type_id = this.interestTypeId;
        body.service_fee = this.serviceFee;

        body.penalty_type_id = this.penaltyTypeId;
        body.penalty_value = this.penaltyValue;
        body.penalty_frequency_id = this.penaltyFrequencyId;

        body.reduce_principal_early = this.reducePrincipalEarly;

        delete body.attach_application_form;

        this.loader = true;

        this.loanApplicationService.update(body)
            .subscribe((res) => {
                   // console.log('Create Source: ', res);
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! Loan Application updated.');
                },
                (error) => {
                    this.loader = false;
                    if (error.lead === 0) {
                        this.notification.showNotification('danger', 'Connection Error !! Nothing updated.' +
                            ' Check your connection and retry.');
                        return;
                    }
                    // An array of all form errors as returned by server
                    this.formErrors = error;

                    if (this.formErrors) {
                        // loop through from fields, If has an error, mark as invalid so mat-error can show
                        for (const prop in this.formErrors) {
                          //  console.log('Hallo: ' , prop);

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

    close() {
        this.dialogRef.close();
    }

    /**
     *
     */
    public onSaveComplete(): void {
        this.loader = false;
        //  this.form.reset();
        this.dialogRef.close(this.firstFormGroup.value);
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }


}
