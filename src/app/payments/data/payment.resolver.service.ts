import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PaymentModel } from '../models/payment-model';
import { PaymentService } from './payment.service';
import { PaymentDataSource } from './payment-data.source';

@Injectable({ providedIn: 'root' })
export class PaymentResolverService implements Resolve<PaymentModel> {

    dataSource: PaymentDataSource;

    constructor(private service: PaymentService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | PaymentModel {
        return this.service.getAll('', 0, 0);
    }
}
