import { BaseModel } from '../../shared/models/base-model';

export class ScheduledDisbursementsModel extends BaseModel {
    branch_id: string;
    mpesa_number: string;
    amount: string;
    created_by: string;

    branch: any;
    createdBy: any;
}
