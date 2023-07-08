import { BaseDataSource } from '../../../../shared/base-data-source';
import { SmsTemplateSettingService } from './sms-template-setting.service';

export class SmsTemplateSettingDataSource extends BaseDataSource {
    constructor(service: SmsTemplateSettingService) {
        super(service);
    }
}
