import { BaseModel } from '../../../shared/models/base-model';

export class LoanPrincipalModel extends BaseModel {
    loan_id: string;
    period_count: string;
    due_date: string;
    amount: string;
    paid_on: string;
    paid_amount: string;
    balance: string;
    loan: any;
}
