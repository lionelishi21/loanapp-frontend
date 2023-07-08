import { BaseDataSource } from '../../../../shared/base-data-source';
import { PeriodSettingService } from './period-setting.service';

export class PeriodSettingDataSource extends BaseDataSource {
    constructor(service: PeriodSettingService) {
        super(service);
    }
}
