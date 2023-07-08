import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../../shared/base-service';
import { BranchModel } from '../model/branch.model';

@Injectable({ providedIn: 'root' })
export class BranchService extends BaseService<BranchModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'branches');
    }
}
