import { BaseDataSource } from '../../../../shared/base-data-source';
import { SmsSettingService } from './sms-setting.service';

export class SmsSettingDataSource extends BaseDataSource {
    constructor(service: SmsSettingService) {
        super(service);
    }
}
