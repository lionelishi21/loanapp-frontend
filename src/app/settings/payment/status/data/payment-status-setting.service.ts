import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaymentStatusSettingModel } from '../model/payment-status-setting.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class PaymentStatusSettingService extends BaseService<PaymentStatusSettingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'payment_statuses');
    }
}
