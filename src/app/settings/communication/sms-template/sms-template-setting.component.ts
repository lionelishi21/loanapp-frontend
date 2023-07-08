import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SmsTemplateSettingService } from './data/sms-template-setting.service';
import { SmsTemplateSettingModel } from './model/sms-template-setting.model';

@Component({
    selector: 'app-sms-template-setting',
    templateUrl: './sms-template-setting.component.html',
    styleUrls: ['./sms-template-setting.component.css']
})
export class SmsTemplateSettingComponent implements OnInit {
    form: FormGroup;
    smsTemplate: SmsTemplateSettingModel;
    formErrors: any;
    loader = false;

    templates: any;

    templateId: any;
    name: any;
    body: any;
    tags: any;

    constructor(private fb: FormBuilder, private route: ActivatedRoute,
                private notification: NotificationService, private smsTemplateSettingService: SmsTemplateSettingService) {

        this.form = this.fb.group({
            name: [{value: '', disabled: true}],
            template: ['', [Validators.required,
                Validators.minLength(2)]],
            body: [''],
            tags: [{value: '', disabled: true}]
        });
    }


    /**
     *
     */
    ngOnInit(): void {
        this.fetchSmsTemplates();
    }

    /**
     *
     */
    fetchSmsTemplates() {
        this.smsTemplateSettingService.list(['name', 'display_name', 'body', 'tags'])
            .subscribe((res) => this.templates = res,
                () => this.templates = []
            );
    }

    /**
     * Update supporting fields when Template drop down changes content
     * @param value
     */
    onTemplateItemChange(value) {
        this.templateId = this.templates.find((item: any) => item.id === value).id;
        this.name = this.templates.find((item: any) => item.id === value).name;
        this.body = this.templates.find((item: any) => item.id === value).body;
        this.tags = this.templates.find((item: any) => item.id === value).tags;

        this.form.patchValue({
            name: this.name,
            body: this.body,
            tags: this.tags
        });
    }


    /**
     *
     */
    update() {
        const body = Object.assign({}, this.smsTemplate, this.form.value);
        body.id = this.templateId;
        this.loader = true;
        this.smsTemplateSettingService.update(body)
            .subscribe((data) => {
                  //  console.log('Update email template: ', data);
                    this.loader = false;

                    // notify success
                    this.notification.showNotification('success', 'Success !!  Sms Template has been updated.');
                    this.fetchSmsTemplates();
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
