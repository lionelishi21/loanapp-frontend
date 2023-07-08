import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BulkPaymentsModel } from '../models/bulk-payments-model';
import { BulkPaymentsService } from './bulk-payments.service';
import { BulkPaymentsDataSource } from './bulk-payments-data.source';

@Injectable({ providedIn: 'root' })
export class BulkPaymentsResolverService implements Resolve<BulkPaymentsModel> {

    dataSource: BulkPaymentsDataSource;

    constructor(private service: BulkPaymentsService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | BulkPaymentsModel {
        return this.service.getAll('', 0, 0);
    }
}
