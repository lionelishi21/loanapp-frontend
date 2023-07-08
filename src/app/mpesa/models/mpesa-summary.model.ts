import { BaseModel } from '../../shared/models/base-model';

export class MpesaSummaryModel extends BaseModel {
    account_balance: string;
    transaction_count: string;
    customer_count: string;
    total_disbursement: string;
    total_mpesa_received: string;
}
