import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../../shared/base-service';
import { EmployeeModel } from '../model/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService extends BaseService<EmployeeModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'employees');
    }
}
