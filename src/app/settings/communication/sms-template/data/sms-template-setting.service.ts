import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SmsTemplateSettingModel } from '../model/sms-template-setting.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class SmsTemplateSettingService extends BaseService<SmsTemplateSettingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'sms_templates');
    }
}
