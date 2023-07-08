import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BorrowerStatusSettingModel } from '../model/borrower-status-setting.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class BorrowerStatusSettingService extends BaseService<BorrowerStatusSettingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'borrower_statuses');
    }
}
