import { Injectable } from '@angular/core';
import { UserProfileModel } from '../model/user-profile.model';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserProfileService } from './user-profile.service';

@Injectable({ providedIn: 'root' })
export class UserProfileResolverService implements Resolve<UserProfileModel> {

    constructor(private service: UserProfileService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | UserProfileModel {
        return this.service.getAll('', 1, 1);
    }
}
