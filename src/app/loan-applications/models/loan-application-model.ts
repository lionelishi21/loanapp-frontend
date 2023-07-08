import { BaseModel } from '../../shared/models/base-model';

export class LoanApplicationModel extends BaseModel {
    status_id: string;
    witnessed_by_user_id: string;
    reviewed_by_user_id: string;
    reviewed_on: string;
    reviewed_on_display: string;
    status: string;
    approved_on: string;
    rejected_on: string;

    member_id: string;
    loan_officer_id: string;

    loan_type_id: string;
    interest_type_id: string;
    service_fee: string;
    service_fee_display: string;

    penalty_type_id: string;
    penalty_value: string;
    penalty_frequency_id: string;
    reduce_principal_early: string;

    application_date: string;
    application_date_display: string;

    amount_applied: string;
    amount_applied_display: string;

    amount_to_disburse: string;
    amount_to_disburse_display: string;

    interest_rate: string;
    repayment_period: string;
    payment_frequency: string;
    periodic_payment_amount: string;

    interest_type: string;

    disburse_method_id: string;

    bank_account: string;
    disburse_note: string;

    cheque_number: string;
    cheque_date: string;
    bank_name: string;
    bank_branch: string;

    mpesa_number: string;
    mpesa_first_name: string;
    mpesa_last_name: string;

    witness_type_id: string;
    witness_first_name: string;
    witness_last_name: string;
    witness_country: string;
    witness_county: string;
    witness_city: string;
    witness_national_id: string;
    witness_phone: string;
    witness_email: string;
    witness_postal_address: string;
    witness_residential_address: string;

    attach_application_form: string;

    guarantors: [];
    assets: [];
    member: {account_id};
    loanType: {};

    loan_application_form: File | null;

    bank_fields: {};

    disburseMethod: any;
    witnessType: any;
    other_banking_details: any;
}
