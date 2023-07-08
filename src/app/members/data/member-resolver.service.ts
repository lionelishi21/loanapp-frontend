import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberService } from './member.service';
import { MemberModel } from '../models/member-model';

@Injectable({ providedIn: 'root' })
export class MemberResolverService implements Resolve<MemberModel> {

    memberId = '';
    id: string;
    member: any;

    constructor(private memberService: MemberService) {}

    resolve(snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | MemberModel {

        this.id = snapshot.params.id;

        // If there's data in the service, show it, otherwise fetch from db (This is incase of a page reload)
        this.memberService.selectedMemberChanges$.subscribe(data => {
            this.member = data;
        });

        if ( this.member == null) {
            this.member = this.memberService.getById(this.id);
        }

        return this.member;
    }
}
