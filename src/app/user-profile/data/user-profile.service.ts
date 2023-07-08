import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserProfileModel } from '../model/user-profile.model';
import { Observable } from 'rxjs';
import { BaseService } from '../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class UserProfileService extends BaseService<UserProfileModel> {
    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient) {
        super( httpClient, 'user_profile');
        this.localHttpClient = httpClient;
    }

    /**
     * Create a new resource
     * @param item
     */
    public create(item: any): Observable<UserProfileModel> {
        return this.localHttpClient.post<any>(super.getResourceUrl(), item);
    }

    /**
     * Create a new resource
     * @param item
     */
    public update(item: any): Observable<UserProfileModel> {
        return this.localHttpClient.put<any>(super.getItemUrl(item.id), item);
    }

    /**
     * Create a new resource
     * @param item
     */
    public updatePhoto(item: any): Observable<UserProfileModel> {
        const itemUrl = 'upload_photo';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }

    /**
     *
     * @param file_path
     */
    public fetchPhoto(file_path: any): Observable<File> {
        const imageUrl = 'fetch_photo';
        const url =  `${super.getResourceUrl()}/${imageUrl}`;
        return this.localHttpClient.post<any>(url, {}, { responseType: 'blob' as 'json'});
    }
}
