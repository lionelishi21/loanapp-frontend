import { BaseDataSource } from '../../../../shared/base-data-source';
import { CommunicationGeneralSettingService } from './communication-general-setting.service';

export class CommunicationGeneralSettingDataSource extends BaseDataSource {
    constructor(service: CommunicationGeneralSettingService) {
        super(service);
    }
}
