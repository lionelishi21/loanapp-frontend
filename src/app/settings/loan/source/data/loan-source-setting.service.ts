import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoanSourceSettingModel } from '../model/loan-source-setting.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class LoanSourceSettingService extends BaseService<LoanSourceSettingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'lead_sources');
    }
}
