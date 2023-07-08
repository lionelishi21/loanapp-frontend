import { BaseModel } from '../../../shared/models/base-model';

export class BranchSettingModel extends BaseModel {
    company_name: string;
    contact_email: string;
    default_tax_id: string;
    logo_url: string;
}
