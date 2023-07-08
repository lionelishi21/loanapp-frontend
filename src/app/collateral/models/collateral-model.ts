import { BaseModel } from '../../shared/models/base-model';

export class CollateralModel extends BaseModel {
    branch_id: string;
    member_id: string;
    asset_number: string;
    title: string;
    description: string;
    valuation_date: string;
    valued_by: string;
    valuer_phone: string;
    valuation_amount: string;
    location: string;
    registration_number: string;
    registered_to: string;
    condition: string;
    notes: string;

    created_by: string;
    updated_by: string;
    deleted_by
}
