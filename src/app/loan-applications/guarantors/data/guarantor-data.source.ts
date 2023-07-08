import { GuarantorService } from './guarantor.service';
import { BaseDataSource } from '../../../shared/base-data-source';

export class GuarantorDataSource extends BaseDataSource {
    constructor(service: GuarantorService) {
        super(service);
    }
}
