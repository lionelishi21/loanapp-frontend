import { BaseDataSource } from '../../shared/base-data-source';
import { UserProfileService } from './user-profile.service';

export class UserProfileDatasource extends BaseDataSource {
    constructor(service: UserProfileService) {
        super(service);
    }
}
