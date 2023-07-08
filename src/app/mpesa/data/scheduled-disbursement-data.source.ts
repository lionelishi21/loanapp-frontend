import { ScheduledDisbursementService } from './scheduled-disbursement.service';
import { BaseDataSource } from '../../shared/base-data-source';

export class ScheduledDisbursementDataSource extends BaseDataSource {
    constructor(service: ScheduledDisbursementService) {
        super(service);
    }
}
