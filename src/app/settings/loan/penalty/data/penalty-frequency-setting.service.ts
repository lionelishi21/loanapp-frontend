import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../../shared/base-service';
import { PenaltyFrequencySettingModel } from '../model/penalty-frequency-setting.model';

@Injectable({ providedIn: 'root' })
export class PenaltyFrequencySettingService extends BaseService<PenaltyFrequencySettingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'penalty_frequencies');
    }
}
