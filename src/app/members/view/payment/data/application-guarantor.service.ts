import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MemberPaymentModel } from '../model/member-payment.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class ApplicationGuarantorService extends BaseService<MemberPaymentModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'payment_methods');
    }
}
