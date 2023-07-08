import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SmsSettingModel } from '../model/sms-setting.model';
import { SmsSettingService } from './sms-setting.service';

@Injectable({ providedIn: 'root' })
export class SmsSettingResolverService implements Resolve<SmsSettingModel> {

    constructor(private service: SmsSettingService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | SmsSettingModel {

        return this.service.getAll('', 1, 1);
    }
}
