import { BaseModel } from '../../../../shared/models/base-model';

export class CommunicationSettingModel extends BaseModel {
    name: string;
    display_name: string;
    email_template: string;
    sms_template: string;
}
