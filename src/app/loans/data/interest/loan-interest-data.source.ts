import { LoanInterestService } from './loan-interest.service';
import { BaseDataSource } from '../../../shared/base-data-source';

export class LoanInterestDataSource extends BaseDataSource {
    constructor(service: LoanInterestService) {
        super(service);
    }
}
