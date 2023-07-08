import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BorrowerModel } from '../models/borrower-model';
import { BorrowerService } from './borrower.service';
import { BorrowerDataSource } from './borrower-data.source';

@Injectable({ providedIn: 'root' })
export class BorrowerResolverService implements Resolve<BorrowerModel> {

    dataSource: BorrowerDataSource;

    constructor(private service: BorrowerService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | BorrowerModel {

        return this.service.getAll('', 0, 0);
    }
}
