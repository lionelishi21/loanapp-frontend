import { BaseModel } from '../../../../shared/models/base-model';

export class PaymentMethodSettingModel extends BaseModel {
    name: string;
    display_name: string;
    description: string;
}
