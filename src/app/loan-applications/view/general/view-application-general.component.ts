import { Component, Input, OnInit } from '@angular/core';
import { ApplicationGuarantorService } from '../guarantor/data/application-guarantor.service';
import { NotificationService } from '../../../shared/notification.service';
import { MatDialog } from '@angular/material';
import { LoanApplicationService } from '../../data/loan-application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
    selector: 'app-edit-application-general',
    templateUrl: './view-application-general.component.html',
    styleUrls: ['./view-application-general.component.css']
})
export class ViewApplicationGeneralComponent implements OnInit {

    id: string;
    loanApplicationData: any;
    loanApplicationId = '';
    loanApplicationData$: any;

    step = 0;
    loader = false;
    applicationForm = false;

    constructor(private service: ApplicationGuarantorService, private notification: NotificationService,
                private activeRoute: ActivatedRoute, private dialog: MatDialog,
                private loanApplicationService: LoanApplicationService,  private router: Router) {
    }

    ngOnInit() {

        this.loanApplicationData$ = this.loanApplicationService.selectedLoanApplicationChanges$;

        this.loanApplicationService.selectedLoanApplicationChanges$.subscribe(data => {

            if (data) {
                this.loanApplicationData = data;
                this.loanApplicationId = data.id;
                if(data.attach_application_form != null && data.attach_application_form != 'null' && data.attach_application_form != '')
                    this.applicationForm = true;
            }
        });

        this.id = this.activeRoute.snapshot.params['id'];
    }

    setStep(index: number) {
        this.step = index;
    }

    nextStep() {
        this.step++;
    }

    prevStep() {
        this.step--;
    }

    /**
     *
     */
    downloadForm() {
        this.getApplicationFomFromService();
    }

    /**
     *
     */
    getApplicationFomFromService() {
        this.loader = true;
        if (this.loanApplicationData && this.loanApplicationData.attach_application_form !== null) {
            this.loanApplicationService.fetchApplicationForm(this.loanApplicationData.attach_application_form).subscribe(res => {
                const fileURL = URL.createObjectURL(res);
                window.open(fileURL, '_blank');
                this.loader = false;
            }, error => {
                this.loader = false;
            });
        }
    }
}
