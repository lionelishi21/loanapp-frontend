import { BaseModel } from '../../../../shared/models/base-model';

export class EmailTemplateSettingModel extends BaseModel {
    name: string;
    template: string;
    display_name: string;
    body: string;
    tags: string;
}
