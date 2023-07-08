import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { EmailTemplateSettingModel } from '../model/email-template-setting.model';
import { EmailTemplateSettingService } from './email-template-setting.service';

@Injectable({ providedIn: 'root' })
export class EmailTemplateSettingResolverService implements Resolve<EmailTemplateSettingModel> {

    constructor(private service: EmailTemplateSettingService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | EmailTemplateSettingModel {

        return this.service.getAll('', 1, 1);
    }
}
