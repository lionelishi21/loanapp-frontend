import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TransactionModel } from '../models/transaction-model';
import { TransactionService } from './transaction.service';
import { TransactionDataSource } from './transaction-data.source';

@Injectable({ providedIn: 'root' })
export class TransactionResolverService implements Resolve<TransactionModel> {

    dataSource: TransactionDataSource;

    constructor(private service: TransactionService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | TransactionModel {
        return this.service.getAll('', 0, 0);
    }
}
