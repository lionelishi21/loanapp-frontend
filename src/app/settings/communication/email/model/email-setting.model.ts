import { BaseModel } from '../../../../shared/models/base-model';

export class EmailSettingModel extends BaseModel {
    driver: string;
    host: string;
    username: string;
    password: string;
    port: string;
    from_address: string;
    from_name: string;
}
