import { MemberService } from './member.service';
import { BaseDataSource } from '../../shared/base-data-source';

export class MemberDataSource extends BaseDataSource {
    constructor(service: MemberService) {
        super(service);
    }
}
