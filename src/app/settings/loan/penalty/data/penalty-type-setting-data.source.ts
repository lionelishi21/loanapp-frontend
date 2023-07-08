import { BaseDataSource } from '../../../../shared/base-data-source';
import { PenaltyTypeSettingService } from './penalty-type-setting.service';

export class PenaltyTypeSettingDataSource extends BaseDataSource {
    constructor(service: PenaltyTypeSettingService) {
        super(service);
    }
}
