import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../../../shared/notification.service';
import { EmailSettingService } from '../email/data/email-setting.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailSettingModel } from '../email/model/email-setting.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-sms-setting-setting',
    templateUrl: './sms-setting.component.html',
    styleUrls: ['./sms-setting.component.css']
})
export class SmsSettingComponent implements OnInit {
    form: FormGroup;
    setting: EmailSettingModel;
    formErrors: any;
    loader = false;

    constructor(private fb: FormBuilder, private route: ActivatedRoute,
                private notification: NotificationService, private emailSettingService: EmailSettingService) {

        this.form = this.fb.group({
            driver: ['', [Validators.required,
                Validators.minLength(2)]],
            host: ['', [Validators.required,
                Validators.minLength(2)]],
            username: [''],
            password: [''],
            port: [''],
            from_address: [''],
            from_name: ['']
        });
    }


    ngOnInit(): void {
        if (this.route.snapshot.data['setting']) {
            this.prePopulateForm(this.route.snapshot.data['setting'].data);
        }
    }

    /**
     *
     * @param setting
     */
    prePopulateForm(setting: EmailSettingModel) {
        this.setting = setting;

        this.form.patchValue({
            driver: this.setting.driver,
            host: this.setting.host,
            username: this.setting.username,
            password: this.setting.password,
            port: this.setting.port,
            from_address: this.setting.from_address,
            from_name: this.setting.from_name
        });
    }

    update() {
        const body = Object.assign({}, this.setting, this.form.value);

        this.loader = true;
        this.emailSettingService.update(body)
            .subscribe((data) => {
                    this.loader = false;

                    // notify success
                    this.notification.showNotification('success', 'Success !! Setting has been updated.');

                },
                (error) => {
                    this.loader = false;
                    if (error.payment === 0) {
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
}
