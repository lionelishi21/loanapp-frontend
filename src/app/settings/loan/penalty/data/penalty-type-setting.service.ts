import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../../shared/base-service';
import { PenaltyTypeSettingModel } from '../model/penalty-type-setting.model';

@Injectable({ providedIn: 'root' })
export class PenaltyTypeSettingService extends BaseService<PenaltyTypeSettingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'penalty_types');
    }
}
