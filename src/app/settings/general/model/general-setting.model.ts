import { BaseModel } from '../../../shared/models/base-model';

export class GeneralSettingModel extends BaseModel {
    business_name: string;
    business_type: string;
    email: string;
    phone: string;
    currency: string;
    country: string;
    county: string;
    town: string;
    physical_address: string;
    postal_address: string;
    postal_code: string;
    logo: File | null;

    favicon: string;
    date_formats: string;
    amount_thousand_separators: string;
    amount_decimals: string;
    amount_decimal_separators: string;

    date_format: string;
    amount_thousand_separator: string;
    amount_decimal: string;
    amount_decimal_separator: string;
}
