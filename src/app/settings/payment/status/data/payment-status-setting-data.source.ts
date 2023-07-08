import { BaseDataSource } from '../../../../shared/base-data-source';
import { PaymentStatusSettingService } from './payment-status-setting.service';

export class PaymentStatusSettingDataSource extends BaseDataSource {
    constructor(service: PaymentStatusSettingService) {
        super(service);
    }
}
