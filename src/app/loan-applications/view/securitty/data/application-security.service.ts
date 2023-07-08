import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../../shared/base-service';
import { CollateralModel } from '../../../../collateral/models/collateral-model';

@Injectable({ providedIn: 'root' })
export class ApplicationSecurityService extends BaseService<CollateralModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'assets');
    }
}
