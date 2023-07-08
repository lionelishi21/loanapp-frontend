import { BaseModel } from '../../../../shared/models/base-model';

export class PeriodSettingModel extends BaseModel {
    start_on: string;
    end_on: string;
    closed_on: string;
}
