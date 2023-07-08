import { BaseDataSource } from '../../../../shared/base-data-source';
import { ApplicationManageService } from './application-manage.service';

export class ApplicationManageDataSource extends BaseDataSource {
    constructor(service: ApplicationManageService) {
        super(service);
    }
}
