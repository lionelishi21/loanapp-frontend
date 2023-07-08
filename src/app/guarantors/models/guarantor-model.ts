import { BaseModel } from '../../shared/models/base-model';

export class GuarantorModel extends BaseModel {
    member_id: string;
    loan_application_id: string;
    loan_id: string;
    assign_date: string;
    guarantee_amount: string;

    branch_id: string;
    notes: string;

    created_by: string;
    updated_by: string;
    deleted_by: string;
}
