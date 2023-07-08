import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoanModel } from '../models/loan-model';
import { LoanService } from './loan.service';

@Injectable({ providedIn: 'root' })
export class LoanResolverService implements Resolve<LoanModel> {

    loanId = '';
    id: string;
    loan: any;

    constructor(private loanService: LoanService) {}

    resolve(snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | LoanModel {

        this.id = snapshot.params.id;

        // If there's data in the service, show it, otherwise fetch from db (This is incase of a page reload)
        this.loanService.selectedLoanChanges$.subscribe(data => {
            this.loan = data;
        });

        if ( this.loan == null) {
            this.loan = this.loanService.getById(this.id);
        }

        return this.loan;
    }
}
