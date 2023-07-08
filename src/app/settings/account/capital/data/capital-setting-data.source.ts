import { BaseDataSource } from '../../../../shared/base-data-source';
import { CapitalSettingService } from './capital-setting.service';

export class CapitalSettingDataSource extends BaseDataSource {
    constructor(service: CapitalSettingService) {
        super(service);
    }
}
