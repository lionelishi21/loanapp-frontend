import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BorrowerModel } from '../models/borrower-model';
import { BaseService } from '../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class BorrowerService extends BaseService<BorrowerModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'borrowers');
    }
}
