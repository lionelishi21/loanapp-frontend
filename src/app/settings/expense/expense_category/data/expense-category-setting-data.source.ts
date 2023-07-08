import { BaseDataSource } from '../../../../shared/base-data-source';
import { ExpenseCategorySettingService } from './expense-category-setting.service';

export class ExpenseCategorySettingDataSource extends BaseDataSource {
    constructor(service: ExpenseCategorySettingService) {
        super(service);
    }
}
