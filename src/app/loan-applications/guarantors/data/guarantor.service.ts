import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../shared/base-service';
import { GuarantorModel } from '../guarantor-model';

@Injectable({ providedIn: 'root' })
export class GuarantorService extends BaseService<GuarantorModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'guarantors');
    }
}
