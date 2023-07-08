import { DashboardService } from './dashboard.service';
import { BaseDataSource } from '../../shared/base-data-source';

export class DashboardDatasource extends BaseDataSource {
    constructor(service: DashboardService) {
        super(service);
    }
}
