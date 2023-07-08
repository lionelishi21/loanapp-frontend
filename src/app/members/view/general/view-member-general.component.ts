import { Component, Input, OnInit } from '@angular/core';
import { ApplicationGuarantorService } from '../payment/data/application-guarantor.service';
import { NotificationService } from '../../../shared/notification.service';
import { MatDialog } from '@angular/material';
import { MemberService } from '../../data/member.service';

@Component({
    selector: 'app-view-member-general',
    templateUrl: './view-member-general.component.html',
    styleUrls: ['./view-member-general.component.css']
})
export class ViewMemberGeneralComponent implements OnInit {

    memberData: any;
    memberId = '';
    memberData$: any;

    profilePicUrl: string;
    profilePicFileToUpload: File = null;

    imageToShow: any;

    loader = false;
    memberShipForm = false;


    constructor(private service: ApplicationGuarantorService, private notification: NotificationService,
                private dialog: MatDialog, private memberService: MemberService) {}

    ngOnInit() {

        this.memberData$ = this.memberService.selectedMemberChanges$;
        this.memberService.selectedMemberChanges$.subscribe(data => {

            if (data) {
                this.memberData = data;
                this.memberId = data.id;
                if(data.membership_form != null && data.membership_form != 'null' && data.membership_form != '')
                    this.memberShipForm = true;
            }
        });
    }

    getImageFromService() {
      //  this.isImageLoading = true;
        this.memberService.getImage(this.memberData.passport_photo).subscribe(data => {
            this.createImageFromBlob(data);
        }, error => {
        });
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
        if (this.memberData && this.memberData.membership_form !== null) {
            this.memberService.fetchMembershipForm(this.memberData.membership_form).subscribe(res => {
                const fileURL = URL.createObjectURL(res);
                window.open(fileURL, '_blank');
                this.loader = false;
            }, error => {
                this.loader = false;
            });
        }
    }
}
