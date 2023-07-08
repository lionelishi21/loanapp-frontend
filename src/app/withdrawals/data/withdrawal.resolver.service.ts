import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { WithdrawalModel } from '../models/withdrawal-model';
import { WithdrawalService } from './withdrawal.service';
import { WithdrawalDataSource } from './withdrawal-data.source';

@Injectable({ providedIn: 'root' })
export class WithdrawalResolverService implements Resolve<WithdrawalModel> {

    dataSource: WithdrawalDataSource;

    constructor(private service: WithdrawalService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | WithdrawalModel {
        return this.service.getAll('', 0, 0);
    }
}
