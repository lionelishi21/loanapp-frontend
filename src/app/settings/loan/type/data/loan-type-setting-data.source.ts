import { BaseDataSource } from '../../../../shared/base-data-source';
import { LoanTypeSettingService } from './loan-type-setting.service';

export class LoanTypeSettingDataSource extends BaseDataSource {
    constructor(service: LoanTypeSettingService) {
        super(service);
    }
}
