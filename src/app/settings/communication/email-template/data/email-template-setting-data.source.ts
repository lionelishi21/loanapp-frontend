import { BaseDataSource } from '../../../../shared/base-data-source';
import { EmailTemplateSettingService } from './email-template-setting.service';

export class EmailTemplateSettingDataSource extends BaseDataSource {
    constructor(service: EmailTemplateSettingService) {
        super(service);
    }
}
