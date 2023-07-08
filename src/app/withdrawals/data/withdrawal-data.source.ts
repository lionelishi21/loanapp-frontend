import { WithdrawalService } from './withdrawal.service';
import { BaseDataSource } from '../../shared/base-data-source';

export class WithdrawalDataSource extends BaseDataSource {
    constructor(service: WithdrawalService) {
        super(service);
    }
}
