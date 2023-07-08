import { BranchService } from './branch.service';
import { BaseDataSource } from '../../../../shared/base-data-source';

export class BranchDataSource extends BaseDataSource {
    constructor(service: BranchService) {
        super(service);
    }
}
