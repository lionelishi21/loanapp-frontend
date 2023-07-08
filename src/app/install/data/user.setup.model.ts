import { BaseModel } from '../../shared/models/base-model';

export class UserSetupModel extends BaseModel {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
}
