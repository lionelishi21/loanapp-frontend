import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaymentMethodSettingModel } from '../model/payment-method-setting.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class PaymentMethodSettingService extends BaseService<PaymentMethodSettingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'payment_methods');
    }
}
