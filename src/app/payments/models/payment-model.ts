import { BaseModel } from '../../shared/models/base-model';

export class PaymentModel extends BaseModel {
    account_id: string;
    amount: string;
    method_id: string;
    transaction_id: string;
    payment_date: string;
    paid_by: string;
    payment_reason: string;
    receipt_number: string;
    attachment: string;
    notes: string;

    member: any;
    branch: any;
    paymentMethod: any;

    branch_id: string;
    member_id: string;

    cheque_number: string;
    bank_name: string;
    bank_branch: string;
    cheque_date: string;

    is_mpesa: string;
    transaction_type: string;
    trans_id: string;
    trans_time: string;
    business_short_code: string;
    bill_ref_number: string;
    invoice_number: string;

    mpesa_number: string;
    mpesa_first_name: string;
    mpesa_middle_name: string;
    mpesa_last_name: string;

    org_account_balance: string;
    third_party_trans_id: string;

    created_by: string;
    updated_by: string;
    deleted_by: string;
}
