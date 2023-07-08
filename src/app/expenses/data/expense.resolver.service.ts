import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ExpenseModel } from '../models/expense-model';
import { ExpenseService } from './expense.service';
import { ExpenseDataSource } from './expense-data.source';

@Injectable({ providedIn: 'root' })
export class ExpenseResolverService implements Resolve<ExpenseModel> {

    dataSource: ExpenseDataSource;

    constructor(private service: ExpenseService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | ExpenseModel {

        return this.service.getAll('', 0, 0);
    }
}
