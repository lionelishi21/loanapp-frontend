import { BaseModel } from '../../shared/models/base-model';

export class WithdrawalModel extends BaseModel {
    member_id: string;
    amount: string;
    withdrawal_date: string;
    disburse_method_id: string;
    withdrawal_number: string;
    withdrawal_charges: string;
    balance_before_withdrawal: string;
    balance_after_withdrawal: string;
    status: string;
    notes: string;

    branch: any;
    member: any;
    paymentMethod: any;

    created_by: string;
    updated_by: string;
    deleted_by: string;
}
