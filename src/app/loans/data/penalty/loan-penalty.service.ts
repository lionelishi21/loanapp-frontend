import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoanPenaltyModel } from './loan-penalty-model';
import { BaseService } from '../../../shared/base-service';
import { UserProfileModel } from '../../../user-profile/model/user-profile.model';

@Injectable({ providedIn: 'root' })
export class LoanPenaltyService extends BaseService<LoanPenaltyModel> {
    private selectedLoanSource = new BehaviorSubject<LoanPenaltyModel | null>(null);
    selectedLoanChanges$ = this.selectedLoanSource.asObservable();

    private  localHttpClient: HttpClient;

    constructor(httpClient: HttpClient) {
        super( httpClient, 'loan_penalties');
        this.localHttpClient = httpClient;
    }

    changeSelectedLoan(selectedLoan: LoanPenaltyModel | null ): void {
        this.selectedLoanSource.next(selectedLoan);
    }

    /**
     * Create a new resource
     * @param item
     */
    public waive(item: any): Observable<any> {
        const itemUrl = 'waive';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }

    /**
     * Create a new resource
     * @param item
     */
    public updatePhoto(item: any): Observable<UserProfileModel> {
        const itemUrl = 'upload_photo';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }
}
