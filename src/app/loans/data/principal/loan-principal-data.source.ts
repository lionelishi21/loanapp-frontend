import { LoanPrincipalService } from './loan-principal.service';
import { BaseDataSource } from '../../../shared/base-data-source';

export class LoanPrincipalDataSource extends BaseDataSource {
    constructor(service: LoanPrincipalService) {
        super(service);
    }
}
