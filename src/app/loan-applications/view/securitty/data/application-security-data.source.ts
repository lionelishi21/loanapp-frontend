import { BaseDataSource } from '../../../../shared/base-data-source';
import { ApplicationSecurityService } from './application-security.service';

export class ApplicationSecurityDataSource extends BaseDataSource {
    constructor(service: ApplicationSecurityService) {
        super(service);
    }
}
