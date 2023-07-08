import { BorrowerService } from './borrower.service';
import { BaseDataSource } from '../../shared/base-data-source';

export class BorrowerDataSource extends BaseDataSource {
    constructor(service: BorrowerService) {
        super(service);
    }
}
