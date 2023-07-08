import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberModel } from '../models/member-model';
import { MemberService } from './member.service';
import { MemberDataSource } from './member-data.source';

@Injectable({ providedIn: 'root' })
export class MemberResolverService implements Resolve<MemberModel> {

    dataSource: MemberDataSource;

    constructor(private service: MemberService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | MemberModel {
        return this.service.getAll('', 0, 0);
    }
}
