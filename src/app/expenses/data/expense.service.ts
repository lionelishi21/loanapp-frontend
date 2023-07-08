import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExpenseModel } from '../models/expense-model';
import { BaseService } from '../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class ExpenseService extends BaseService<ExpenseModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'expenses');
    }
}
