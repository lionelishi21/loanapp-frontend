import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { GuarantorModel } from '../models/guarantor-model';
import { GuarantorService } from './guarantor.service';
import { GuarantorDataSource } from './guarantor-data.source';

@Injectable({ providedIn: 'root' })
export class GuarantorResolverService implements Resolve<GuarantorModel> {

    dataSource: GuarantorDataSource;

    constructor(private service: GuarantorService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | GuarantorModel {

        return this.service.getAll('', 0, 0);
    }
}
