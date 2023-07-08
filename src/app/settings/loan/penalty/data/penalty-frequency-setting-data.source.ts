import { BaseDataSource } from '../../../../shared/base-data-source';
import { PenaltyFrequencySettingService } from './penalty-frequency-setting.service';

export class PenaltyFrequencySettingDataSource extends BaseDataSource {
    constructor(service: PenaltyFrequencySettingService) {
        super(service);
    }
}
