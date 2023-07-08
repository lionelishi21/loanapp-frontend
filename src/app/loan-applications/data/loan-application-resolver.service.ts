import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoanApplicationModel } from '../models/loan-application-model';
import { LoanApplicationService } from './loan-application.service';

@Injectable({ providedIn: 'root' })
export class LoanApplicationResolverService implements Resolve<LoanApplicationModel> {

    loanApplicationId = '';
    id: string;
    loanApp: any;

    constructor(private loanApplicationService: LoanApplicationService) {}

    resolve(snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | LoanApplicationModel {

       // console.log('snap...');
       // console.log(snapshot.params.id);
        this.id = snapshot.params.id;

        // If there's data in the loan application service, show it, otherwise fetch from db (This is incase of a page reload)
        this.loanApplicationService.selectedLoanApplicationChanges$.subscribe(data => {
            this.loanApp = data;
        });

        if ( this.loanApp == null) {
         //  console.log('Ftech data from api');
           this.loanApp = this.loanApplicationService.getById(this.id);
        }

        return this.loanApp;
    }
}
