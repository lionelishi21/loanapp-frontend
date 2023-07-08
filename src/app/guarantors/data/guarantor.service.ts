import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GuarantorModel } from '../models/guarantor-model';
import { BaseService } from '../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class GuarantorService extends BaseService<GuarantorModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'guarantors');
    }
}
