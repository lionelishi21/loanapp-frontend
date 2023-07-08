import { LoanApplicationService } from './loan-application.service';
import { BaseDataSource } from '../../shared/base-data-source';

export class LoanApplicationDataSource extends BaseDataSource {
    constructor(service: LoanApplicationService) {
        super(service);
    }
}
