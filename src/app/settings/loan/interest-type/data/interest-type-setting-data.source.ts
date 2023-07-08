import { BaseDataSource } from '../../../../shared/base-data-source';
import { InterestTypeSettingService } from './interest-type-setting.service';

export class InterestTypeSettingDataSource extends BaseDataSource {
    constructor(service: InterestTypeSettingService) {
        super(service);
    }
}
