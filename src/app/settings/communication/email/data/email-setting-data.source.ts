import { BaseDataSource } from '../../../../shared/base-data-source';
import { EmailSettingService } from './email-setting.service';

export class EmailSettingDataSource extends BaseDataSource {
    constructor(service: EmailSettingService) {
        super(service);
    }
}
