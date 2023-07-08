import { BaseModel } from '../../shared/models/base-model';

export class BorrowerModel extends BaseModel {
    member_id: string;
    credit_score: string;
    borrower_status_id: string;
    witness_type_id: string;
    witness_first_name: string;
    witness_last_name: string;
    witness_country: string;
    witness_city: string;
    witness_national_id: string;
    witness_phone: string;
    witness_email: string;
    witness_postal_address: string;
    witness_residential_address: string;
    notes: string;
}
