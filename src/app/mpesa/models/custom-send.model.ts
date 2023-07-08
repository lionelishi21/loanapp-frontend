import { BaseModel } from '../../shared/models/base-model';

export class CustomSendModel extends BaseModel {
    phone: string;
    amount: string;
    description: string;
}
