import { CollateralService } from './collateral.service';
import { BaseDataSource } from '../../shared/base-data-source';

export class CollateralDataSource extends BaseDataSource {
    constructor(service: CollateralService) {
        super(service);
    }
}
