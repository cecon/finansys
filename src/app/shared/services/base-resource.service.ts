import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseResourceModel } from '../models/base-resource.model';
import { environment } from './../../../environments/environment';

export abstract class BaseResourceService<T extends BaseResourceModel> {
    protected apiPath: string;
    protected http: HttpClient;
    constructor(
        path: string,
        protected injector: Injector,
        protected jsonDataToResourceFn: (jsonData: string) => T
        ) {
        this.http = injector.get(HttpClient);
        this.apiPath = `${environment.api}/${path}`;
    }
    getAll(): Observable<T[]> {
        return this.http.get(this.apiPath).pipe(
            map((jsonData: Array<any>) => this.jsonDataToResources(jsonData)),
            catchError(this.handleError)
        );
    }
    getById(id: number): Observable<T> {
        const url = `${this.apiPath}/${id}`;
        return this.http.get(url).pipe(
            map((jsonData: Array<any>) => this.jsonDataToResource(jsonData)),
            catchError(this.handleError)
        );
    }

    update(resource: T): Observable<T> {
        const url = `${this.apiPath}/${resource.id}`;
        return this.http.put(url, resource).pipe(
            map((jsonData: Array<any>) => this.jsonDataToResource(jsonData)),
            catchError(this.handleError)
        );
    }

    delete(resource: T): Observable<T> {
        const url = `${this.apiPath}/${resource.id}`;
        return this.http.delete(url).pipe(
            map(() => null),
            catchError(this.handleError)
        );
    }

    create(resource: T): Observable<T> {
        return this.http.post(this.apiPath, resource).pipe(
            map((jsonData: Array<any>) => this.jsonDataToResource(jsonData)),
            catchError(this.handleError)
        );
    }

    protected jsonDataToResources(jsonData: any[]): T[] {
        const resources: T[] = [];
        jsonData.forEach(element => resources.push(this.jsonDataToResourceFn(element)));
        return resources;
    }

    protected jsonDataToResource(jsonData: any): T {
        return this.jsonDataToResourceFn(jsonData);
    }

    protected handleError(error: any): Observable<any> {
        console.log('ERRO NA REQUISIÇÃO => ', error);
        return throwError(error);
    }
}
