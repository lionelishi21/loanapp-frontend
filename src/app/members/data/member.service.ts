import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MemberModel } from '../models/member-model';
import { BaseService } from '../../shared/base-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProfileModel } from '../../user-profile/model/user-profile.model';

@Injectable({ providedIn: 'root' })
export class MemberService extends BaseService<MemberModel> {
    private selectedMemberSource = new BehaviorSubject<MemberModel | null>(null);
    selectedMemberChanges$ = this.selectedMemberSource.asObservable();

    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient) {
        super( httpClient, 'members');
        this.localHttpClient = httpClient;
    }

    changeSelectedMember(selectedMember: MemberModel | null ): void {
        this.selectedMemberSource.next(selectedMember);
    }


    /**
     * Create a new resource
     * @param item
     */
    public create(item: any): Observable<MemberModel> {
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
    public updateMembershipForm(item: any): Observable<UserProfileModel> {
        const itemUrl = 'membership_form_update';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }

    /**
     *
     * @param file_path
     */
    public fetchMembershipForm(file_path: any): Observable<any> {
        const imageUrl = 'membership_form';
        const url =  `${super.getResourceUrl()}/${imageUrl}`;
        return this.localHttpClient.post<any>(url, {file_path}, { responseType: 'blob' as 'json'});
    }

    /**
     * Create a new resource
     * @param item
     */
    public updatePhoto(item: any): Observable<UserProfileModel> {
        const itemUrl = 'update_photo';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }

    /**
     *
     * @param file_path
     */
    public fetchPhoto(file_path: any): Observable<File> {
        const imageUrl = 'fetch_photo';
        const url =  `${super.getResourceUrl()}/${imageUrl}`;
        return this.localHttpClient.post<any>(url, {file_path}, { responseType: 'blob' as 'json'});
    }
}
