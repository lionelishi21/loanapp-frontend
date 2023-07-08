import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoanApplicationModel } from '../models/loan-application-model';
import { BaseService } from '../../shared/base-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProfileModel } from '../../user-profile/model/user-profile.model';

@Injectable({ providedIn: 'root' })
export class LoanApplicationService extends BaseService<LoanApplicationModel> {

    private selectedLoanApplicationSource = new BehaviorSubject<LoanApplicationModel | null>(null);
    selectedLoanApplicationChanges$ = this.selectedLoanApplicationSource.asObservable();

    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient) {
        super( httpClient, 'loan_applications');
        this.localHttpClient = httpClient;
    }

    changeSelectedLoanApplication(selectedLoanApplication: LoanApplicationModel | null ): void {
        this.selectedLoanApplicationSource.next(selectedLoanApplication);
    }

    /**
     * Create a new resource
     * @param item
     */
    public create(item: any): Observable<LoanApplicationModel> {
        return this.localHttpClient.post<any>(super.getResourceUrl(), item);
    }

    /**
     *
     * @param file_path
     */
    getImage(file_path: any): Observable<File> {
        const imageUrl = 'profile_pic';
        const url =  `${super.getResourceUrl()}/${imageUrl}`;
        return this.localHttpClient.post<any>(url, {file_path}, { responseType: 'blob' as 'json'});
    }

    /**
     *
     * @param item
     */
    public updateApplicationForm(item: any): Observable<UserProfileModel> {
        const itemUrl = 'application_form_update';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }

    /**
     *
     * @param file_path
     */
    public fetchApplicationForm(file_path: any): Observable<any> {
        const imageUrl = 'application_form';
        const url =  `${super.getResourceUrl()}/${imageUrl}`;
        return this.localHttpClient.post<any>(url, {file_path}, { responseType: 'blob' as 'json'});
    }
}
