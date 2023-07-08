import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ScheduledDisbursementDataSource } from './scheduled-disbursement-data.source';
import { ScheduledDisbursementsModel } from '../models/scheduled-disbursements.model';
import { ScheduledDisbursementService } from './scheduled-disbursement.service';

@Injectable({ providedIn: 'root' })
export class ScheduledDisbursementResolverService implements Resolve<ScheduledDisbursementsModel> {

    dataSource: ScheduledDisbursementDataSource;

    constructor(private service: ScheduledDisbursementService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | ScheduledDisbursementsModel {
        return this.service.getAll('', 0, 0);
    }
}
