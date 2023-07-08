import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmailTemplateSettingService } from './data/email-template-setting.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EmailTemplateSettingModel } from './model/email-template-setting.model';

@Component({
    selector: 'app-email-template-setting',
    templateUrl: './email-template-setting.component.html',
    styleUrls: ['./email-template-setting.component.css']
})
export class EmailTemplateSettingComponent implements OnInit {
    form: FormGroup;
    emailTemplate: EmailTemplateSettingModel;
    formErrors: any;
    loader = false;

    templates: any;

    templateId: any;
    name: any;
    subject: any;
    body: any;
    tags: any;

    public Editor = ClassicEditor;


    /**
     *
     * @param fb
     * @param route
     * @param notification
     * @param emailTemplateSettingService
     */
    constructor(private fb: FormBuilder, private route: ActivatedRoute,
                private notification: NotificationService, private emailTemplateSettingService: EmailTemplateSettingService) {

        this.form = this.fb.group({
            name: [{value: '', disabled: true}],
            template: ['', [Validators.required,
                Validators.minLength(2)]],
            subject: ['', [Validators.required,
                Validators.minLength(2)]],
            body: [''],
            tags: [{value: '', disabled: true}]
        });
    }


    /**
     *
     */
    ngOnInit(): void {
      this.fetchEmailTemplates();
    }

    /**
     *
     */
    fetchEmailTemplates() {
        this.emailTemplateSettingService.list(['name', 'display_name', 'subject', 'body', 'tags'])
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
        this.subject = this.templates.find((item: any) => item.id === value).subject;
        this.body = this.templates.find((item: any) => item.id === value).body;
        this.tags = this.templates.find((item: any) => item.id === value).tags;

        this.form.patchValue({
            name: this.name,
            subject: this.subject,
            body: this.body,
            tags: this.tags
        });
    }

    /**
     *
     */
    update() {
        const body = Object.assign({}, this.emailTemplate, this.form.value);
        body.id = this.templateId;

        this.loader = true;
        this.emailTemplateSettingService.update(body)
            .subscribe((data) => {
                    this.loader = false;

                    // notify success
                    this.notification.showNotification('success', 'Success !!  Email Template has been updated.');
                    this.fetchEmailTemplates();
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
