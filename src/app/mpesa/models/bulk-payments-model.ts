import { BaseModel } from '../../shared/models/base-model';

export class BulkPaymentsModel extends BaseModel {
    transaction_amount: string;
    transaction_receipt: string;
    b2C_recipientIs_registered_customer: string;
    b2C_charges_paid_account_available_funds: string;
    receiver_party_public_name: string;
    transaction_completed_date_time: string;
    b2C_utility_account_available_funds: string;
    b2C_working_account_available_funds: string;
}
