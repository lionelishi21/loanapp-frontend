import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoanStatusSettingModel } from '../model/loan-status-setting.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class LoanStatusSettingService extends BaseService<LoanStatusSettingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'loan_statuses');
    }
}
