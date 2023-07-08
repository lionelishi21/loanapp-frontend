import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatStepper } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from '../../shared/notification.service';
import { AccountingModel } from '../models/accounting-model';
import { AccountingService } from '../data/accounting.service';

@Component({
    selector: 'app-statement',
    styleUrls: ['./statement.component.css'],
    templateUrl: './statement.component.html'
})
export class StatementComponent implements OnInit  {

    account: AccountingModel;
    id: string;
    type: string;

    loanAmount: any;
    totalPeriods: any;
    interest: any;

    loader = false;

    table: any;

    @ViewChild('stepper', {static: true }) stepper: MatStepper;

    tableColumns = [
        'date',
        'narration',
        'debit',
        'credit',
        'balance'
    ];

    dataSource: any;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private accountingService: AccountingService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<StatementComponent>) {
        this.id = row.id;
        this.type = row.type;
    }

    ngOnInit() {
        this.loader = true;

        switch (this.type){
            case 'general' : {
                this.generalAccountStatement(this.id, false);
                break
            }
            case 'member' : {
                this.depositAccountStatement(this.id, false);
                break
            }
            case 'loan' : {
                this.loanAccountStatement(this.id, false);
                break
            }
            default : {
                break
            }
        }
    }

    /**
     * Download statement file
     */
    downloadPdf() {
        switch (this.type){
            case 'general' : {
                this.generalAccountStatement(this.id, true);
                break
            }
            case 'member' : {
                this.depositAccountStatement(this.id, true);
                break
            }
            case 'loan' : {
                this.loanAccountStatement(this.id, true);
                break
            }
            default : {
                break
            }
        }
    }


    /**
     * Display displayed file
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
        link.download="statement.pdf";
        link.click();
        setTimeout(function(){
            window.URL.revokeObjectURL(data);
        }, 100);
    }

    /**
     * Fetch member deposit account statement
     */
    private depositAccountStatement(id: string, pdf: boolean){

        if(pdf == true){
            this.loader = true;
            this.accountingService.downloadMemberAccountStatement({id: id, pdf: pdf})
                .subscribe((res) => {
                       // this.loader = false;
                        this.dialogRef.close();
                        this.showFile(res);
                    },
                    () => {
                        this.loader = false;
                        this.dialogRef.close();
                    }
                );
        }

        this.accountingService.getDepositAccountStatement({id: id, pdf: pdf})
            .subscribe((res) => {
                    this.loader = false;
                    // console.log(res);
                    this.dataSource = res.data.statement;
                    this.account = res.data;
                },
                () => {
                    this.loader = false;
                    this.dataSource = [];
                }
            );
    }

    /** Fetch loan account statement
     *
     */
    private loanAccountStatement(id: string, pdf: boolean){
        if(pdf == true){
            this.loader = true;
            this.accountingService.downloadLoanAccountStatement({id: id, pdf: pdf})
                .subscribe((res) => {
                        // this.loader = false;
                        this.dialogRef.close();
                        this.showFile(res);
                    },
                    () => {
                        this.loader = false;
                        this.dialogRef.close();
                    }
                );
        }

        this.accountingService.getLoanAccountStatement({id: id, pdf: pdf})
            .subscribe((res) => {
                    this.loader = false;
                    this.dataSource = res.data.statement;
                    this.account = res.data;
                },
                () => {
                    this.loader = false;
                    this.dataSource = [];
                }
            );
    }

    /**
     * Fetch generic account statement
     */
    private generalAccountStatement(id: string, pdf: boolean){
        if(pdf == true){
            this.loader = true;
            this.accountingService.downloadGeneralAccountStatement({id: id, pdf: pdf})
                .subscribe((res) => {
                        this.dialogRef.close();
                        this.showFile(res);
                    },
                    () => {
                        this.loader = false;
                        this.dialogRef.close();
                    }
                );
        }

        this.accountingService.getGeneralAccountStatement({id: id, pdf: pdf})
            .subscribe((res) => {
                    this.loader = false;
                    this.dataSource = res.data.statement;
                    this.account = res.data;
                },
                () => {
                    this.loader = false;
                    this.dataSource = [];
                }
            );
    }


    close() {
        this.dialogRef.close();
    }

}
