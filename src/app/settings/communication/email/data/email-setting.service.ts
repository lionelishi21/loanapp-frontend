import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmailSettingModel } from '../model/email-setting.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class EmailSettingService extends BaseService<EmailSettingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'email_settings');
    }
}
