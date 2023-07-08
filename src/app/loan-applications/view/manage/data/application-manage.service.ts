import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationManageModel } from '../model/application-manage.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class ApplicationManageService extends BaseService<ApplicationManageModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'payment_methods');
    }
}
