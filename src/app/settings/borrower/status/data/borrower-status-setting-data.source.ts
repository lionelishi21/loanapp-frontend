import { BaseDataSource } from '../../../../shared/base-data-source';
import { BorrowerStatusSettingService } from './borrower-status-setting.service';

export class BorrowerStatusSettingDataSource extends BaseDataSource {
    constructor(service: BorrowerStatusSettingService) {
        super(service);
    }
}
