import { BaseModel } from '../../../../shared/models/base-model';

export class MemberPaymentModel extends BaseModel {
    name: string;
    description: string;

    member_id: string;
    loan_application_id: string;
    assign_date: string;
    guarantee_amount: string;
}
