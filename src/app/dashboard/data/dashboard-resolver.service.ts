import { Injectable } from '@angular/core';
import { DashboardModel } from '../model/dashboard.model';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DashboardService } from './dashboard.service';

@Injectable({ providedIn: 'root' })
export class DashboardResolverService implements Resolve<DashboardModel> {

    constructor(private service: DashboardService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | DashboardModel {

        return this.service.getAll('', 1, 1);
    }
}
