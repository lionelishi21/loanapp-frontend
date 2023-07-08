import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoanModel } from '../models/loan-model';
import { LoanService } from './loan.service';
import { LoanDataSource } from './loan-data.source';

@Injectable({ providedIn: 'root' })
export class LoanResolverService implements Resolve<LoanModel> {

    dataSource: LoanDataSource;

    constructor(private service: LoanService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | LoanModel {
        return this.service.getAll('', 0, 0);
    }
}
