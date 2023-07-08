import { MpesaSummaryService } from './mpesa-summary.service';
import { BaseDataSource } from '../../shared/base-data-source';

export class MpesaSummaryDatasource extends BaseDataSource {
    constructor(service: MpesaSummaryService) {
        super(service);
    }
}
