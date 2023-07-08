import { BaseModel } from './models/base-model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { API_VERSION } from '../../assets/config/api-version';

export class BaseService<T extends BaseModel> {

    private readonly apiUrl: string;
    private readonly resourceUrl: string;

    private protocol = 'https://';
    private readonly version: any;

    constructor( private httpClient: HttpClient, private endpoint: string) {
        this.version = environment.production ?  API_VERSION.prod : API_VERSION.dev;
        const parsedUrl = new URL(window.location.href);
        this.apiUrl = this.protocol + parsedUrl.hostname + this.version;

        this.resourceUrl = this.apiUrl + `/` + this.endpoint;
    }

    /**
     *
     */
    protected getApiUrl(): string {
        return this.apiUrl;
    }

    /**
     *
     */
    protected getResourceUrl(): string {
        return this.resourceUrl;
    }

    /**
     * API item url
     * @param uuid
     */
    protected getItemUrl(uuid: string): string {
        return `${this.resourceUrl}/${uuid}`;
    }

    private getUrl(uuid?: string) {
        if (uuid !== null) {
            return `${this.resourceUrl}/${uuid}`;
        }
        return this.resourceUrl;
    }

    /**
     *
     * @param fieldName
     */
    list(fieldName: any): Observable<{}> {
        return this.httpClient.get(this.getResourceUrl(), {
            params: new HttpParams()
                .set('list', fieldName)
        });
    }

    /**
     * Fetch resources from remote API
     * @param filter
     * @param page
     * @param limit
     * @param whereField
     * @param whereValue
     * @param sortField
     * @param sortDirection
     */
    getAll(filter: string, page: number, limit: number, sortField: string = '', sortDirection: string = '',
           whereField: string = '', whereValue: string = ''): Observable<{}> {
        return this.httpClient.get(this.getResourceUrl(), {
            params: new HttpParams()
                .set('filter', filter)
                .set('page', page.toString())
                .set('limit', limit.toString())
                .set('sortField', sortField)
                .set('sortDirection', sortDirection)
                .set('whereField', whereField)
                .set('whereValue', whereValue)
        });
    }

    fetchBranches(page = 0, limit = 4, sortField: string = '', sortDirection: string = ''): Observable<{}> {
        return this.httpClient.get(this.getResourceUrl(), {
            params: new HttpParams()
                .set('filter', '')
                .set('page', page.toString())
                .set('limit', limit.toString())
                .set('sortField', sortField)
                .set('sortDirection', sortDirection)
        });
    }

    /**
     * Fetch single item by specified id
     * @param uuid
     */
    getById(uuid: string): Observable<T> {
        return this.httpClient
            .get<T>(this.getItemUrl(uuid));
    }

    /**
     * Create a new resource
     * @param item
     */
    public create(item: T): Observable<T> {
        return this.httpClient.post<T>(this.getResourceUrl(), item);
    }

    /**
     * Update an existing resource
     * @param item
     */
    public update(item: T): Observable<T> {
        return this.httpClient.put<T>(this.getItemUrl(item.id), item);
    }

    /**
     * Remove a record from db
     * @param item
     */
    public delete(item: T) {
        return this.httpClient.delete(this.getItemUrl(item.id));
    }
}
