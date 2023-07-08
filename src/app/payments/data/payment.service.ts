import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaymentModel } from '../models/payment-model';
import { BaseService } from '../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class PaymentService extends BaseService<PaymentModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'payments');
    }
}
