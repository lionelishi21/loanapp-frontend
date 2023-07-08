import { BaseModel } from '../../../../shared/models/base-model';

export class BranchModel extends BaseModel {
    name: string;
    branch_code: string;
    location: string;
    description: string;
    country: string;
    town: string;
    address: string;
}
