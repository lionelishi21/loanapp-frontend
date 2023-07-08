import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MpesaSummaryModel } from '../models/mpesa-summary.model';
import { BaseService } from '../../shared/base-service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MpesaSummaryService extends BaseService<MpesaSummaryModel> {

    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient) {
        super( httpClient, 'mpesa_summary');
        this.localHttpClient = httpClient;
    }

    /**
     *
     */
    public getMpesaBalance(): Observable<MpesaSummaryModel> {
        const itemUrl = 'balance';
        return this.localHttpClient.get<any>(`${super.getResourceUrl()}/${itemUrl}`);
    }

}
