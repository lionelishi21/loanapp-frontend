import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmailTemplateSettingModel } from '../model/email-template-setting.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class EmailTemplateSettingService extends BaseService<EmailTemplateSettingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'email_templates');
    }
}
