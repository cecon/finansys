import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseResourceModel } from '../models/base-resource.model';
import { environment } from './../../../environments/environment';

export abstract class BaseResourceService<T extends BaseResourceModel> {
    protected apiPath: string;
    protected http: HttpClient;
    constructor(path: string, protected injector: Injector) {
        this.http = injector.get(HttpClient);
        this.apiPath = `${environment.api}/${path}`;
    }
    getAll(): Observable<T[]> {
        return this.http.get(this.apiPath).pipe(
            catchError(this.handleError),
            map(this.jsonDataToResources)
        );
    }
    getById(id: number): Observable<T> {
        const url = `${this.apiPath}/${id}`;
        return this.http.get(url).pipe(
            catchError(this.handleError),
            map(this.jsonDataToResource)
        );
    }

    update(resource: T): Observable<T> {
        const url = `${this.apiPath}/${resource.id}`;
        return this.http.put(url, resource).pipe(
            catchError(this.handleError),
            map(this.jsonDataToResource)
        );
    }

    delete(resource: T): Observable<T> {
        const url = `${this.apiPath}/${resource.id}`;
        return this.http.delete(url).pipe(
            catchError(this.handleError),
            map(() => null)
        );
    }

    create(entry: T): Observable<T> {
        return this.http.post(this.apiPath, entry).pipe(
          catchError(this.handleError),
          map(this.jsonDataToResource)
        );
      }

    protected jsonDataToResources(jsonData: any[]): T[] {
        const resources: T[] = [];
        jsonData.forEach(element => resources.push(element as T));
        return resources;
    }

    protected jsonDataToResource(jsonData: any): T {
        const resource: T[] = [];
        return jsonData as T;
    }

    protected handleError(error: any): Observable<any> {
        console.log('ERRO NA REQUISIÇÃO => ', error);
        return throwError(error);
      }
}
