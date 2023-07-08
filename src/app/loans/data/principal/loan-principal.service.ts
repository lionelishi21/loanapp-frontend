import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { LoanPrincipalModel } from './loan-principal-model';
import { BaseService } from '../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class LoanPrincipalService extends BaseService<LoanPrincipalModel> {
    private selectedLoanSource = new BehaviorSubject<LoanPrincipalModel | null>(null);
    selectedLoanChanges$ = this.selectedLoanSource.asObservable();

    constructor(httpClient: HttpClient) {
        super( httpClient, 'loan_principals');
    }

    changeSelectedLoan(selectedLoan: LoanPrincipalModel | null ): void {
        this.selectedLoanSource.next(selectedLoan);
    }
}
