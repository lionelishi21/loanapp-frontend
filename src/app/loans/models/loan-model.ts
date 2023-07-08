import { BaseModel } from '../../shared/models/base-model';

export class LoanModel extends BaseModel {
    data: {amortization: []};
    branch_id: string;
    member_id: string;

    loan_reference_number: string;
    loan_application_id: string;
    loan_type_id: string;

    interest_rate: string;
    interest_type_id: string;
    payment_period: string;

    loan_status_id: string;
    approved_by_user_id: string;

    amount_approved: string;
    loan_disbursed: string;

    start_date: string;
    end_date: string;
    balance: string;

    payment_frequency_id: string;
    next_repayment_date: string;

    created_by: string;
    updated_by: string;
    deleted_by: string;

    amortization: [];

    payments: [];
    loanPayment: any;
    loanOfficer: any;
    member: any;
    loanType: any;
}
