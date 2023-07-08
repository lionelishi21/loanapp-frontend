import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExpenseCategorySettingModel } from '../model/expense-category-setting.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class ExpenseCategorySettingService extends BaseService<ExpenseCategorySettingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'expense_categories');
    }
}
