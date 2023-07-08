import { BaseModel } from '../../../../shared/models/base-model';

export class EmployeeModel extends BaseModel {
    employee_number: string;
    first_name: string;
    last_name: string;
    salutation: string;
    country: string;
    national_id_number: string;
    passport_number: string;
    email: string;
    telephone_number: string;
    address: string;
    postal_code: string;
    county: string;
    city: string;
    nhif_number: string;
    nssf_number: string;
    kra_pin: string;
    gender: string;
    job_group: string;
    designation_id: string;
    department_id: string;
    birth_day: string;
    profile_picture: string;
    national_id_image: string;
}
