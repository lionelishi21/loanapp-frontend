import { BulkPaymentsService } from './bulk-payments.service';
import { BaseDataSource } from '../../shared/base-data-source';

export class BulkPaymentsDataSource extends BaseDataSource {
    constructor(service: BulkPaymentsService) {
        super(service);
    }
}
