import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardModel } from '../model/dashboard.model';
import { BaseService } from '../../shared/base-service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService extends BaseService<DashboardModel> {

    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient) {
        super( httpClient, 'summaries');
        this.localHttpClient = httpClient;
    }

    /**
     *
     * @param item
     */
    public downloadDueTodayStatement(item: any): Observable<any>{
        const itemUrl = 'due_today';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item, { responseType: 'blob' as 'json'});
    }

    /**
     *
     * @param item
     */
    public downloadOverDueStatement(item: any): Observable<any>{
        const itemUrl = 'over_due';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item, { responseType: 'blob' as 'json'});
    }
}
