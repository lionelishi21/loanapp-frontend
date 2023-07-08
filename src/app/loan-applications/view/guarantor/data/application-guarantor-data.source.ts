import { BaseDataSource } from '../../../../shared/base-data-source';
import { ApplicationGuarantorService } from './application-guarantor.service';

export class ApplicationGuarantorDataSource extends BaseDataSource {
    constructor(service: ApplicationGuarantorService) {
        super(service);
    }
}
