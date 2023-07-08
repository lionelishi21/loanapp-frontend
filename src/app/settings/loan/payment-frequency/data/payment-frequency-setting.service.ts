import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaymentFrequencySettingModel } from '../model/payment-frequency-setting.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class PaymentFrequencySettingService extends BaseService<PaymentFrequencySettingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'payment_frequencies');
    }
}
