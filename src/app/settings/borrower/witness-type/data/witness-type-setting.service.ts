import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WitnessTypeSettingModel } from '../model/witness-type-setting.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class WitnessTypeSettingService extends BaseService<WitnessTypeSettingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'witness_types');
    }
}
