import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InterestTypeSettingModel } from '../model/interest-type-setting.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class InterestTypeSettingService extends BaseService<InterestTypeSettingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'interest_types');
    }
}
