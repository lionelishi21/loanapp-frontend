import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../shared/base-service';
import { SetupModel } from './setup.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SetupService extends BaseService<SetupModel> {

    private  localHttpClient: HttpClient;

    /**
     *
     * @param httpClient
     */
    constructor(httpClient: HttpClient) {
        super( httpClient, 'install');
        this.localHttpClient = httpClient;
    }

    /**
     *
     */
    public checkRequirements(): Observable<SetupModel> {
        return this.localHttpClient.get<any>(super.getResourceUrl());
    }

    /**
     *
     */
    public checkPermissions(): Observable<SetupModel> {
        const itemUrl = 'permissions';
        return this.localHttpClient.get<any>(`${super.getResourceUrl()}/${itemUrl}`);
    }

    /**
     *
     * @param item
     */
    public setUpDatabase(item: any): Observable<SetupModel> {
        const itemUrl = 'database';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }

    /**
     *
     * @param item
     */
    public setUpUser(item: any): Observable<SetupModel> {
        const itemUrl = 'user';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }
}
