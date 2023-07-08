import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationGuarantorModel } from '../model/application-guarantor.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class ApplicationGuarantorService extends BaseService<ApplicationGuarantorModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'guarantors');
    }
}
