import { BaseDataSource } from '../../../../shared/base-data-source';
import { PaymentFrequencySettingService } from './payment-frequency-setting.service';

export class PaymentFrequencySettingDataSource extends BaseDataSource {
    constructor(service: PaymentFrequencySettingService) {
        super(service);
    }
}
