import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WithdrawalModel } from '../models/withdrawal-model';
import { BaseService } from '../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class WithdrawalService extends BaseService<WithdrawalModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'withdrawals');
    }
}
