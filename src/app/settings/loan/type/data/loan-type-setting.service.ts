import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoanTypeSettingModel } from '../model/loan-type-setting.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class LoanTypeSettingService extends BaseService<LoanTypeSettingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'loan_types');
    }
}
