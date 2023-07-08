import { BaseDataSource } from '../../../../shared/base-data-source';
import { WitnessTypeSettingService } from './witness-type-setting.service';

export class WitnessTypeSettingDataSource extends BaseDataSource {
    constructor(service: WitnessTypeSettingService) {
        super(service);
    }
}
