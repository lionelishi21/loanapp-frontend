import { BaseDataSource } from '../../../../shared/base-data-source';
import { PaymentMethodSettingService } from './payment-method-setting.service';

export class PaymentMethodSettingDataSource extends BaseDataSource {
    constructor(service: PaymentMethodSettingService) {
        super(service);
    }
}
