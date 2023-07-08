import { BaseModel } from '../../shared/models/base-model';

export class TransactionModel extends BaseModel {
    branch_id: string;
    fiscal_period_id: string;
    loan_id: string;
    payment_id: string;
    amount: string;
    transaction_date: string;
    loan_interest_repayments_id: string;
    loan_principal_repayments_id: string;
    loan_penalties_id: string;
    transaction_type: string;
    created_by: string;
    updated_by: string;
    deleted_by: string;
}
