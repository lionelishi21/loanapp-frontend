import { BaseModel } from '../../shared/models/base-model';

export class ExpenseModel extends BaseModel {
    branch_id: string;
    category_id: string;
    title: string;
    amount: string;
    expense_date: string;
    registered_by_user_id: string;
    notes: string;
    attachment: string;

    created_by: string;
    updated_by: string;
}
