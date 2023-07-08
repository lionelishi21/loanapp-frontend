import { ExpenseService } from './expense.service';
import { BaseDataSource } from '../../shared/base-data-source';

export class ExpenseDataSource extends BaseDataSource {
    constructor(service: ExpenseService) {
        super(service);
    }
}
