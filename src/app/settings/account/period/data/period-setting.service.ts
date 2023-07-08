import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PeriodSettingModel } from '../model/period-setting.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class PeriodSettingService extends BaseService<PeriodSettingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'fiscal_periods');
    }
}
