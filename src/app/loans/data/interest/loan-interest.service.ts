import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { LoanInterestModel } from './loan-interest-model';
import { BaseService } from '../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class LoanInterestService extends BaseService<LoanInterestModel> {
    private selectedLoanSource = new BehaviorSubject<LoanInterestModel | null>(null);
    selectedLoanChanges$ = this.selectedLoanSource.asObservable();

    constructor(httpClient: HttpClient) {
        super( httpClient, 'loan_interests');
    }

    changeSelectedLoan(selectedLoan: LoanInterestModel | null ): void {
        this.selectedLoanSource.next(selectedLoan);
    }
}
