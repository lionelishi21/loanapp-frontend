import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CapitalSettingModel } from '../model/capital-setting.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class CapitalSettingService extends BaseService<CapitalSettingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'capitals');
    }
}
