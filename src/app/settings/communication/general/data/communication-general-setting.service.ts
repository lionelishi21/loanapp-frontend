import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../../shared/base-service';
import { CommunicationSettingModel } from '../model/communication-setting.model';

@Injectable({ providedIn: 'root' })
export class CommunicationGeneralSettingService extends BaseService<CommunicationSettingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'communication_settings');
    }
}
