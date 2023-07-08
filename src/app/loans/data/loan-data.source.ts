import { LoanService } from './loan.service';
import { BaseDataSource } from '../../shared/base-data-source';

export class LoanDataSource extends BaseDataSource {
    constructor(service: LoanService) {
        super(service);
    }
}
