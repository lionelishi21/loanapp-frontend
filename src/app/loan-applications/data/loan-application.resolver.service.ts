import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoanApplicationModel } from '../models/loan-application-model';
import { LoanApplicationService } from './loan-application.service';
import { LoanApplicationDataSource } from './loan-application-data.source';

@Injectable({ providedIn: 'root' })
export class LoanApplicationResolverService implements Resolve<LoanApplicationModel> {

    dataSource: LoanApplicationDataSource;

    constructor(private service: LoanApplicationService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | LoanApplicationModel {
        return this.service.getAll('', 0, 0);
    }
}
