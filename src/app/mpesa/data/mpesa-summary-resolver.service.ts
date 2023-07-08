import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MpesaSummaryService } from './mpesa-summary.service';
import { MpesaSummaryModel } from '../models/mpesa-summary.model';

@Injectable({ providedIn: 'root' })
export class MpesaSummaryResolverService implements Resolve<MpesaSummaryModel> {

    constructor(private service: MpesaSummaryService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | MpesaSummaryModel {
        return this.service.getAll('', 1, 1);
    }
}
