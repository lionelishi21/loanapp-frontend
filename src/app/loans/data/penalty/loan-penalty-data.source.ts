import { LoanPenaltyService } from './loan-penalty.service';
import { BaseDataSource } from '../../../shared/base-data-source';

export class LoanPenaltyDataSource extends BaseDataSource {
    constructor(service: LoanPenaltyService) {
        super(service);
    }
}
