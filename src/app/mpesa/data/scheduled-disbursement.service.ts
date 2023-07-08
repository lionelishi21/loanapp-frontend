import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../shared/base-service';
import { ScheduledDisbursementsModel } from '../models/scheduled-disbursements.model';

@Injectable({ providedIn: 'root' })
export class ScheduledDisbursementService extends BaseService<ScheduledDisbursementsModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'mpesa_scheduled_disbursements');
    }
}
