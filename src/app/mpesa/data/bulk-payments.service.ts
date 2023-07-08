import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BulkPaymentsModel } from '../models/bulk-payments-model';
import { BaseService } from '../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class BulkPaymentsService extends BaseService<BulkPaymentsModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'mpesa_bulk_payments');
    }
}
