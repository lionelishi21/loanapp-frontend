import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatStepper } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NotificationService } from '../../shared/notification.service';
import { PaymentMethodSettingService } from '../../settings/payment/method/data/payment-method-setting.service';
import * as moment from 'moment';
import { WithdrawalModel } from '../models/withdrawal-model';
import { WithdrawalService } from '../data/withdrawal.service';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, delay, tap, filter, takeUntil } from 'rxjs/operators';


@Component({
    selector: 'app-add-withdrawal',
    styles: [],
    templateUrl: './add-withdrawal.component.html'
})
export class AddWithdrawalComponent implements OnInit, OnDestroy  {

    form: FormGroup;

    formErrors: any;

    payment: WithdrawalModel;

    loader = false;

    isMpesa = false;
    isBank = false;

    paymentMethods: any = [];
    members: any = [];

    accountNumber = '';
    idNumber = '';

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
                private fb: FormBuilder,
                private withdrawalService: WithdrawalService,
                private notification: NotificationService,
                private paymentMethodService: PaymentMethodSettingService,
                private dialogRef: MatDialogRef<AddWithdrawalComponent>) {
        this.members = row.members;

        this.paymentMethodService.list(['name', 'display_name'])
            .subscribe((res) => {
                    this.paymentMethods = res;
                },
                () => this.paymentMethods = []
            );
    }

    ngOnInit() {
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

        this.form = this.fb.group({
            member_id: ['', [Validators.required,
                Validators.minLength(3)]],
            amount: ['', [Validators.required,
                Validators.minLength(1)]],
            withdrawal_date: [moment(), Validators.required],
            method_id: ['', [Validators.required,
                Validators.minLength(3)]],
            notes: [''],
            account_number: [{value: '', disabled: true}],
            id_number: [{value: '', disabled: true}],
            bank_fields: this.fb.group({
                cheque_number: [''],
                cheque_date: [moment(), Validators.required],
                bank_name: [''],
                bank_branch: ['']
            }),
            mpesa_fields: this.fb.group({
                mpesa_number: [''],
                first_name: [''],
                last_name: ['']
            })
        });
    }

    /**
     * Update supporting fields when member drop down changes content
     * @param value
     */
    onMemberItemChange(value) {
        this.accountNumber = this.members.find((item: any) => item.id === value).account.account_number;
        this.idNumber = this.members.find((item: any) => item.id === value).id_number;
        this.form.patchValue({
            account_number: this.accountNumber,
            id_number: this.idNumber
        });
    }

    onPaymentMethodItemChange(value) {
        const paymentMethod = this.paymentMethods.find((item: any) => item.id === value).name;
        this.isMpesa = paymentMethod === 'MPESA';
        this.isBank = paymentMethod === 'BANK';
    }

    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }

    /**
     * Create payment
     */
    create() {

        const body = Object.assign({}, this.payment, this.form.value);

        this.loader = true;

        this.withdrawalService.create(body)
            .subscribe((data) => {
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! New Withdrawal created.');
                },
                (error) => {
                    this.loader = false;
                    // User has no loan
                    if (error.error && error.error.status_code === 404) {
                        this.notification.showNotification('danger', error.error.message);
                        return;
                    }
                    if (error.payment === 0) {
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

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

}

