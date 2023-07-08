import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SmsSettingModel } from '../model/sms-setting.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class SmsSettingService extends BaseService<SmsSettingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'email_settings');
    }
}
