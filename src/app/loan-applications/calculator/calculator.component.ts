import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NotificationService } from '../../shared/notification.service';
import { PaymentMethodSettingService } from '../../settings/payment/method/data/payment-method-setting.service';

import { Router } from '@angular/router';
import { LoanTypeSettingService } from '../../settings/loan/type/data/loan-type-setting.service';
import { MemberService } from '../../members/data/member.service';
import { WitnessTypeSettingService } from '../../settings/borrower/witness-type/data/witness-type-setting.service';
import * as moment from 'moment';
import { LoanService } from '../../loans/data/loan.service';

@Component({
    selector: 'app-calculator',
    styles: [],
    templateUrl: './calculator.component.html'
})
export class CalculatorComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    calculator: any;
    dataSource: any;

    loader = false;
    showResult = false;

    formGroup: FormGroup;

    loanTypes: any = [];

    interestRate = '';
    interestType: any;
    interestTypeId = '';
    serviceFee: any;

    penaltyTypeId: any;
    penaltyValue: any;
    penaltyFrequencyId: any;

    reducePrincipalEarly: boolean;

    repaymentPeriod = '';
    repaymentFrequency = '';
    repaymentFrequencyId: any;

    tableColumns = [
        'count',
        'due_date',
        'payment',
        'interest',
        'principal',
        'balance'
    ];

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
        private fb: FormBuilder, private router: Router, private memberService: MemberService,
                private witnessTypeService: WitnessTypeSettingService,
                private loanTypeService: LoanTypeSettingService, private paymentMethodService: PaymentMethodSettingService,
                private notification: NotificationService, private loanService: LoanService,
                private memberMethodService: PaymentMethodSettingService, private dialogRef: MatDialogRef<CalculatorComponent>) {
        this.loanTypes = row.loanTypes;
    }

    ngOnInit() {
        this.form = this.fb.group({
            loan_type_id: ['', Validators.required],
            start_date: [moment(), Validators.required],
            service_fee: [{value: '', disabled: true}],
            interest_type: [{value: '', disabled: true}],
            interest_rate: [{value: '', disabled: true}],
            repayment_period: [{value: '', disabled: true}],
            payment_frequency: [{value: '', disabled: true}],
            amount: ['', Validators.required],
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

        this.form.patchValue({
            interest_rate: this.interestRate +  ' ( per period )',
            service_fee: this.serviceFee,
            interest_type: this.interestType,
            repayment_period: this.repaymentPeriod,
            payment_frequency: this.repaymentFrequency
        });

    }

    save() {
    }

    close() {
        this.dialogRef.close();
    }

    /**
     * Display or download calculator results
     */
    calculatorResults(pdf) {
        const body = Object.assign({}, this.calculator, this.form.value);
        body.pdf = pdf;

        this.loader = true;
        // Display calculator results
        if(pdf == false){
            this.loanService.calculatorStatement(body)
                .subscribe((res) => {
                        this.loader = false;
                        this.showResult = true;
                        this.dataSource = res;
                    },
                    () => {
                        this.loader = false;
                        this.showResult = true;
                        this.dataSource = [];
                    }
                );
        }
        // Download calculator results
        if(pdf == true){
            this.loanService.downloadCalculatorStatement(body)
                .subscribe((res) => {
                        this.loader = false;
                        this.dialogRef.close();
                        this.showFile(res);
                    },
                    () => {
                        this.loader = false;
                        this.dialogRef.close();
                    }
                );
        }

    }

    /**
     * Display downloaded file
     * @param blob
     */
    showFile(blob){
        let newBlob = new Blob([blob], {type: "application/pdf"});

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }
        const data = window.URL.createObjectURL(newBlob);
        let link = document.createElement('a');
        link.href = data;
        link.download="calculator_result_statement.pdf";
        link.click();
        setTimeout(function(){
            window.URL.revokeObjectURL(data);
        }, 100);
    }

    /**
     *
     */
    public onSaveComplete(): void {
        this.loader = false;
        this.dialogRef.close(this.form.value);
    }

}

