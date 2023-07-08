import { BaseDataSource } from '../../../../shared/base-data-source';
import { LoanSourceSettingService } from './loan-source-setting.service';

export class LoanSourceSettingDataSource extends BaseDataSource {
    constructor(service: LoanSourceSettingService) {
        super(service);
    }
}
