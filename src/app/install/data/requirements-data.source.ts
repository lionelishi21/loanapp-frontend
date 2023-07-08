import { BaseDataSource } from '../../shared/base-data-source';
import { SetupService } from './setup.service';

export class RequirementsDataSource extends BaseDataSource {
    constructor(service: SetupService) {
        super(service);
    }
}
