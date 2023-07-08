import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TransactionModel } from '../models/transaction-model';
import { BaseService } from '../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class TransactionService extends BaseService<TransactionModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'transactions');
    }
}
