import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '../../shared/notification.service';
import { PaymentMethodSettingService } from '../../settings/payment/method/data/payment-method-setting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberModel } from '../models/member-model';
import { MemberService } from '../data/member.service';

@Component({
    selector: 'app-view-member',
    styleUrls: ['./view-member.component.css'],
    templateUrl: './view-member.component.html'
})
export class ViewMemberComponent implements OnInit, AfterViewInit  {

    form: FormGroup;
    generalForm: FormGroup;
    guarantorForm: FormGroup;
    assetForm: FormGroup;

    formErrors: any;

    loanApplication: MemberModel;

    loader = false;

    memberStatuses: any = [];
    members: any = [];
    guarantorStatues: any = [];

    id: string;

    routeData: any;

    memberData: any;
    memberId = '';
    memberData$: any;

    imageToShow: any;

    constructor(private fb: FormBuilder,
                private memberService: MemberService,
                private memberStatusService: PaymentMethodSettingService,
                private notification: NotificationService,
                private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {

        this.id = this.route.snapshot.paramMap.get('id');

        this.memberService.selectedMemberChanges$.subscribe(data => {
            // Data from service
            this.memberData = data;
        });

        if (this.memberData == null) {
            // Data isn't in service, so we fetch from the route resolver
            if (this.route.snapshot.data['member']) {
                this.memberData = this.route.snapshot.data['member'].data;
                this.memberService.changeSelectedMember(this.memberData);
            }
        }

        this.getImageFromService();


        this.form = this.fb.group({
            member_id: [''],
            approved_by_user_id: [''],
            application_date: [''],
            amount_applied: [''],
            repayment_period: [''],
            status_id: [''],
        });

        this.generalForm = this.fb.group({
            member_id: [''],
            loan_application_id: [''],
            assign_date: [''],
            guarantee_amount: [''],
            status_id: ['']
        });

        this.guarantorForm = this.fb.group({
            member_id: [''],
            loan_application_id: [''],
            assign_date: [''],
            guarantee_amount: [''],
            status_id: ['']
        });

        this.assetForm = this.fb.group({
            member_id: [''],
            loan_application_id: [''],
            assign_date: [''],
            guarantee_amount: ['']
        });
    }

    getImageFromService() {
        if (this.memberData && this.memberData.passport_photo !== null) {
            this.memberService.getImage(this.memberData.passport_photo).subscribe(data => {
                this.createImageFromBlob(data);
            }, error => {
                console.log(error);
            });
        }
    }

    createImageFromBlob(image: Blob) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            this.imageToShow = reader.result;
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }
    }

    close() {
    }

    updateGeneralForm() {

    }

    updateGuarantorForm() {

    }

    updateAssetForm() {

    }

    update() {
        const body = Object.assign({}, this.loanApplication, this.form.value);

        this.loader = true;
        this.memberService.update(body)
            .subscribe((data) => {
                    console.log('Update member: ', data);
                    this.loader = false;
                    // notify success
                    this.notification.showNotification('success', 'Success !! Loan application has been updated.');

                },
                (error) => {
                    this.loader = false;
                    console.log('Error at edit member component: ', error);

                    if (error.member === 0) {
                        // notify error
                        return;
                    }
                    // An array of all form errors as returned by server
                    this.formErrors = error;

                    if (this.formErrors) {
                        // loop through from fields, If has an error, mark as invalid so mat-error can show
                        for (const prop in this.formErrors) {
                            console.log('Hallo: ', prop);
                            if (this.form) {
                                this.form.controls[prop].setErrors({incorrect: true});
                            }
                        }
                    }
                });
    }

    ngAfterViewInit(): void {}

}
