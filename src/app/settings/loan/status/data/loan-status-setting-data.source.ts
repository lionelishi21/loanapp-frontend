import { BaseDataSource } from '../../../../shared/base-data-source';
import { LoanStatusSettingService } from './loan-status-setting.service';

export class LoanStatusSettingDataSource extends BaseDataSource {
    constructor(service: LoanStatusSettingService) {
        super(service);
    }
}
