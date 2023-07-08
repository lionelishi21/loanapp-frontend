import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SmsTemplateSettingModel } from '../model/sms-template-setting.model';
import { SmsTemplateSettingService } from './sms-template-setting.service';

@Injectable({ providedIn: 'root' })
export class SmsTemplateSettingResolverService implements Resolve<SmsTemplateSettingModel> {

    constructor(private service: SmsTemplateSettingService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | SmsTemplateSettingModel {

        return this.service.getAll('', 1, 1);
    }
}
