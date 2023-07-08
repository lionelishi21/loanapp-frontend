import { EmployeeService } from './employee.service';
import { BaseDataSource } from '../../../../shared/base-data-source';

export class EmployeeDataSource extends BaseDataSource {
    constructor(service: EmployeeService) {
        super(service);
    }
}
