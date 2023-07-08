import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CollateralModel } from '../models/collateral-model';
import { CollateralService } from './collateral.service';
import { CollateralDataSource } from './collateral-data.source';

@Injectable({ providedIn: 'root' })
export class CollateralResolverService implements Resolve<CollateralModel> {

    dataSource: CollateralDataSource;

    constructor(private service: CollateralService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | CollateralModel {

        return this.service.getAll('', 0, 0);
    }
}
